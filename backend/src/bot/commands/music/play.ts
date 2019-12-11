/**
 * @file Music LaunchMusicCommand - Starts playing music
 *
 * You need to be in a voice channel before you can use this command and Red needs to be allowed to join that channel as well as speak in it.
 * If music is already playing this will add to the queue or otherwise it will join your voice channel and start playing.
 * There are 4 ways to queue songs.
 * 1. YouTube Search Query
 * 2. YouTube video URL
 * 3. YouTube playlist URL
 * 4. YouTube video ID
 *
 * **Aliases**: `add`, `enqueue`, `start`, `join`, `play`
 * @module
 * @category music
 * @name launch
 * @example play final fantasy one winged angel
 * @param {string} Video One of the options linking to a video to play
 */

import { DEFAULT_VOLUME, MAX_LENGTH, MAX_SONGS } from '../../components/Constants';
import { deleteCommandMessages, Song } from '../../components/Utils';
import { Command, CommandoClient, CommandMessage } from 'discord.js-commando';
import {
    Guild, Message, Snowflake, StreamDispatcher,
    StreamOptions, TextChannel, Util, VoiceChannel, VoiceConnection
} from 'discord.js';
import { oneLine, stripIndents } from 'common-tags';
import moment from 'moment';
import { parse, stringify } from 'querystring';
import { MusicQueueType, MusicVoteType, YoutubeVideoType, YoutubeResultList } from 'RedTypes';
import Axios from 'axios';
import ytdl from 'ytdl-core';

interface LaunchMusicArgs {
    videoQuery: string;
}

export default class LaunchMusicCommand extends Command {
    public queue: Map<Snowflake, MusicQueueType>;
    public votes: Map<Snowflake, MusicVoteType>;

    public constructor(client: CommandoClient) {
        super(client, {
            name: 'play',
            aliases: ['add', 'enqueue', 'start', 'join', 'launch'],
            group: 'music',
            memberName: 'play',
            description: 'Adds a song to the queue',
            format: 'YoutubeURL|YoutubeVideoSearch',
            examples: ['play epic sax guy 10 hours'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3,
            },
            args: [
                {
                    key: 'videoQuery',
                    prompt: 'what music would you like to listen to?',
                    type: 'string',
                    parse: (p: string) => p.replace(/<(.+)>/g, '$1'),
                }
            ],
        });

        this.queue = new Map();
        this.votes = new Map();
    }

    private static getPlaylistID(url: string): string {
        return parse(url.split('?')[1]).list as string;
    }

    private static async getVideoByName(name: string): Promise<string | null> {
        try {
            const response = await Axios(`https://www.googleapis.com/youtube/v3/search?${stringify({
                key: process.env.GOOGLE_API_KEY!,
                maxResults: '1',
                part: 'snippet',
                q: name,
                type: 'video',
            })}`);
            const video = response.data.items[0];

            return video.id.videoId;
        } catch (err) {
            return null;
        }
    }

    private static async getVideo(id: string): Promise<YoutubeVideoType | null> {
        try {
            const response = await Axios(`https://www.googleapis.com/youtube/v3/videos?${stringify({
                id,
                key: process.env.GOOGLE_API_KEY!,
                maxResults: 1,
                part: 'snippet,contentDetails',
            })}`);

            if (!response.data.items || !response.data.items.length) throw new Error('cannot_find_video');

            return {
                durationSeconds: moment.duration(response.data.items[0].contentDetails.duration).asSeconds(),
                id: response.data.items[0].id,
                kind: response.data.items[0].kind,
                title: response.data.items[0].snippet.title,
            };
        } catch (err) {
            return null;
        }
    }

    private static async getVideoID(url: string): Promise<YoutubeVideoType | null> {
        try {
            if (/youtu\.be/i.test(url)) {
                return LaunchMusicCommand.getVideo((url.match(/\/[a-zA-Z0-9-_]+$/i) as RegExpMatchArray)[0].slice(1));
            }

            return LaunchMusicCommand.getVideo(parse(url.split('?')[1]).v as string);
        } catch (err) {
            return null;
        }
    }

    private static async startTheJam(connection: VoiceConnection, url: string, ytdlOptions?: any, streamOptions?: StreamOptions) {
        return connection.playStream(ytdl(url, { filter: 'audioonly' }), { bitrate: 4000 });
    }

    public async run(msg: CommandMessage, { videoQuery }: LaunchMusicArgs) {
        const queue = this.queue.get(msg.guild.id);

        if (!msg.member!.voiceChannel) return msg.reply('please join a voice channel before issuing this command.');

        const voiceChannel: VoiceChannel = msg.member!.voiceChannel;
        const statusMsg: Message = await msg.reply('obtaining video details...') as Message;

        if (!queue) {
            const permissions = voiceChannel.permissionsFor(msg.client.user!);

            if (!permissions!.has('CONNECT')) {
                return msg.reply(oneLine(
                    `
            I don't have permission to join your voice channel. Fix your server's permissions
          `
                ));
            }

            if (!permissions!.has('SPEAK')) {
                return msg.reply(oneLine(
                    `
            I don't have permission to speak in your voice channel. Fix your server's permissions
          `
                ));
            }

            const listQueue: MusicQueueType = {
                textChannel: msg.channel as TextChannel,
                voiceChannel,
                connection: null,
                songs: [],
                volume: msg.client.provider.get(msg.guild, 'defaultVolume', DEFAULT_VOLUME),
                playing: false,
            };

            this.queue.set(msg.guild.id, listQueue);

            statusMsg.edit(`${msg.author}, joining your voice channel...`);
            try {
                listQueue.connection = await listQueue.voiceChannel.join();
            } catch (error) {
                this.queue.delete(msg.guild.id);
                statusMsg.edit(`${msg.author}, unable to join your voice channel.`);

                return statusMsg;
            }
        } else if (!queue.voiceChannel.members.has(msg.author!.id)) {
            return msg.reply('please join a voice channel before issuing this command.');
        }

        if (videoQuery.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            await statusMsg.edit('obtaining playlist videos... (this can take a while for long lists)');

            const playlist = LaunchMusicCommand.getPlaylistID(videoQuery);
            const videos = await this.getPlaylistVideos(playlist);

            if (!videos) {
                statusMsg.edit(oneLine(
                    `
            ${msg.author},
            I did not find any videos in that playlist. Are you sure they are public and not unlisted / private?
          `
                ));

                return statusMsg;
            }

            videos.forEach(async (video: YoutubeVideoType | null) => this.handlePlaylist(video as YoutubeVideoType, playlist, msg, statusMsg));

            if (!(this.queue.get(msg.guild.id) as MusicQueueType).playing) {
                this.play(msg.guild, (this.queue.get(msg.guild.id) as MusicQueueType).songs[0]);
            }

            return statusMsg;
        }

        try {
            const video: YoutubeVideoType | null = await LaunchMusicCommand.getVideoID(videoQuery);
            if (!video) throw new Error('no_video_id');

            deleteCommandMessages(msg, this.client);

            this.handleVideo(
                video, queue as MusicQueueType, voiceChannel, msg, statusMsg
            );

            return statusMsg;
        } catch (error) {
            if (/(?:no_video_id)/i.test(error.toString())) {
                try {
                    const videoId = await LaunchMusicCommand.getVideoByName(videoQuery);
                    if (!videoId) return statusMsg.edit(`${msg.author}, there were no search results.`);

                    const video = await LaunchMusicCommand.getVideo(videoId);
                    deleteCommandMessages(msg, this.client);

                    this.handleVideo(
                        video as YoutubeVideoType, queue as MusicQueueType, voiceChannel, msg, statusMsg
                    );

                    return statusMsg;
                } catch (err) {
                    deleteCommandMessages(msg, this.client);

                    return statusMsg.edit(`<@${msg.author!.id}>, couldn't obtain the search result video's details.`);
                }
            }

            return statusMsg.edit(`<@${msg.author!.id}>, couldn't match a youtube result. Was that really a youtube video?`);
        }
    }

    private async handleVideo(
        video: YoutubeVideoType, queue: MusicQueueType, voiceChannel: VoiceChannel,
        msg: CommandMessage, statusMsg: Message
    ): Promise<null> {
        if (!video || !video.durationSeconds || video.durationSeconds === 0) {
            statusMsg.edit(oneLine`${msg.author}, you can't play live streams`);

            return null;
        }

        if (!queue) {
            queue = {
                textChannel: msg.channel as TextChannel,
                voiceChannel,
                connection: null,
                songs: [],
                volume: msg.client.provider.get(msg.guild, 'defaultVolume', DEFAULT_VOLUME),
                playing: false,
            };
            this.queue.set(msg.guild.id, queue);

            const result = this.addSong(msg, video);

            if (!result) {
                statusMsg.edit(oneLine`${msg.author}, I can't play live streams or private videos.`);

                return null;
            }

            const resultMessage = {
                author: {
                    iconURL: msg.author!.displayAvatarURL,
                    name: `${msg.author!.tag} (${msg.author!.id})`,
                },
                color: 3447003,
                description: result,
            };

            if (!result.startsWith('👍')) {
                this.queue.delete(msg.guild.id);
                statusMsg.edit('', { embed: resultMessage });

                return null;
            }

            statusMsg.edit(`${msg.author}, joining your voice channel...`);
            try {
                queue.connection = await queue.voiceChannel.join();
                this.play(msg.guild, queue.songs[0]);
                statusMsg.delete();

                return null;
            } catch (error) {
                this.queue.delete(msg.guild.id);
                statusMsg.edit(oneLine(
                    `
            ${msg.author}, something went wrong playing music.
            Please contact <@${this.client.owners[0].id}> as there is likely something wrong in the code!
            Use \`${msg.client.commandPrefix}invite\` to get an invite to the support server.
          `
                ));

                return null;
            }
        } else {
            const result = this.addSong(msg, video);

            if (!result) {
                statusMsg.edit(oneLine`${msg.author}, I can't play live streams or private videos.`);

                return null;
            }

            const resultMessage = {
                author: {
                    iconURL: msg.author!.displayAvatarURL,
                    name: `${msg.author!.tag} (${msg.author!.id})`,
                },
                color: 3447003,
                description: result,
            };

            statusMsg.edit('', { embed: resultMessage });

            return null;
        }
    }

    private async handlePlaylist(video: YoutubeVideoType, playlistId: string,
        msg: CommandMessage, statusMsg: Message): Promise<null> {
        if (!video || !video.durationSeconds || video.durationSeconds === 0) {
            statusMsg.edit(oneLine`${msg.author}, I can't play live streams or private videos.`);

            return null;
        }

        const result = this.addSong(msg, video);

        if (result) {
            const resultMessage = {
                author: {
                    iconURL: msg.author!.displayAvatarURL,
                    name: `${msg.author!.tag} (${msg.author!.id})`,
                },
                color: 3447003,
                description: result,
            };

            if (!result.startsWith('👍')) {
                this.queue.delete(msg.guild.id);
                statusMsg.edit('', { embed: resultMessage });

                return null;
            }

            statusMsg.edit('', {
                embed: {
                    description: stripIndents(
                        `
              Adding [the playlist](https://www.youtube.com/playlist?list=${playlistId}) to the queue!
              Check what's been added with: \`${msg.client.commandPrefix}queue\`!
            `
                    ),
                    color: 3447003,
                    author: {
                        name: `${msg.author!.tag} (${msg.author!.id})`,
                        icon_url: msg.author!.displayAvatarURL,
                    },
                },
            });

            return null;
        }

        statusMsg.edit(oneLine(
            `
        ${msg.author},
        Found a live stream or private video in the playlist which I cannot play so I skipped in.
      `
        ));

        return null;
    }

    private addSong(msg: CommandMessage, video: YoutubeVideoType) {
        const queue = this.queue.get(msg.guild.id);
        const songNumerator = (prev: number, curSong: Song) => {
            if (curSong.member.id === msg.author!.id) {
                prev += 1;
            }

            return prev;
        };
        if (video) {
            if (!this.client.isOwner(msg.author!)) {
                const songMaxLength = msg.client.provider.get(msg.guild, 'maxLength', MAX_LENGTH);
                const songMaxSongs = msg.client.provider.get(msg.guild, 'maxSongs', MAX_SONGS);

                if (songMaxLength > 0 && video.durationSeconds > songMaxLength * 60) {
                    return oneLine`
        👎 ${Util.escapeMarkdown(video.title)}
        (${Song.timeString(video.durationSeconds)})
        is too long. No songs longer than ${songMaxLength} minutes!
      `;
                }
                if ((queue as MusicQueueType).songs.some((songIterator: Song) => songIterator.id === video.id)) {
                    return `👎 ${Util.escapeMarkdown(video.title)} is already queued.`;
                }

                if (songMaxSongs > 0 && (queue as MusicQueueType).songs.reduce(songNumerator, 0) >= songMaxSongs) {
                    return `👎 you already have ${songMaxSongs} songs in the queue. Don't hog all the airtime!`;
                }
            }

            const song = new Song(video, msg.member!);

            (queue as MusicQueueType).songs.push(song);

            return oneLine`👍 ${`[${song}](${`${song.url}`})`}`;
        }

        return null;
    }

    private async play(guild: Guild, song: Song): Promise<void | boolean> {
        const queue = this.queue.get(guild.id);
        const vote = this.votes.get(guild.id);

        if (vote) {
            clearTimeout(vote.timeout);
            this.votes.delete(guild.id);
        }

        if (!song) {
            if (queue && !queue.isTriggeredByStop) {
                queue.textChannel.send('We\'ve run out of songs! Better queue up some more tunes.');
            }
            (queue as MusicQueueType).voiceChannel.leave();

            return this.queue.delete(guild.id);
        }

        let streamErrored = false;
        let dispatcher: StreamDispatcher;
        const playing: Promise<Message> = (queue as MusicQueueType).textChannel.send({
            embed: {
                author: {
                    iconURL: song.avatar,
                    name: song.username,
                },
                color: 4317875,
                description: `${`[${song}](${`${song.url}`})`}`,
                image: { url: song.thumbnail },
            },
        }) as Promise<Message>;

        try {
            dispatcher = await LaunchMusicCommand.startTheJam(((queue as MusicQueueType).connection as VoiceConnection),
                song.url,
                { quality: 'highestaudio', highWaterMark: 1 << 25 },
                {});

            dispatcher.on('end', () => {
                if (streamErrored) return;
                (queue as MusicQueueType).songs.shift();
                this.play(guild, (queue as MusicQueueType).songs[0]);
            });

            dispatcher.on('error', (err: Error) => {
                (queue as MusicQueueType).textChannel.send(`An error occurred while playing the song: \`${err}\``);
            });

            dispatcher.setVolumeLogarithmic((queue as MusicQueueType).volume / 5);
            song.dispatcher = dispatcher;
            song.playing = true;

            (queue as MusicQueueType).playing = true;

            return undefined;
        } catch (err) {
            console.log(err)
            streamErrored = true;
            playing.then(async msg => msg.edit(`❌ Couldn't play ${song}. What a drag!`));
            (queue as MusicQueueType).songs.shift();

            return this.play(guild, (queue as MusicQueueType).songs[0]);
        }
    }

    private async getPlaylistVideos(id: string) {
        try {
            const response = await Axios(`https://www.googleapis.com/youtube/v3/playlistItems?${stringify({
                key: process.env.GOOGLE_API_KEY!,
                maxResults: 25,
                part: ['snippet', 'contentDetails'].join(','),
                playlistId: id,
            })}`);
            const data = await response.data as YoutubeResultList;

            const videos = await Promise.all(
                data.items.map(async video => (
                    LaunchMusicCommand.getVideo(video.snippet.resourceId.videoId)
                ))
            );

            return videos;
        } catch (err) {
            return null;
        }
    }
}