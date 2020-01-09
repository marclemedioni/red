/**
 * @file Music SkipSongCommand - Skips the currently playing song and jumps to the next in queue or stops if it is the
 *     last song of the queue
 *
 * A vote to skip is started if there are 4 or more people in the voice channel with `(amount of members) / 3` as
 *     required amount of votes (bot doesn't count as a member). Staff that can delete messages can force the skip by
 *     using `skip force. You need to be in a voice channel before you can use this command.
 *
 * **Aliases**: `next`
 * @module
 * @category music
 * @name skip
 * @example skip
 * -OR-
 * skip force
 * @param {string} [force] Force the skip if you are the requester or a server moderator
 */

import { deleteCommandMessages, roundNumber } from '../../components/Utils';
import { Command, CommandoClient, CommandMessage } from 'discord.js-commando';
import { Guild, Snowflake } from 'discord.js';
import { MusicCommand, MusicQueueType, MusicVoteType } from 'RedTypes';

export default class SkipSongCommand extends Command {
    public songVotes: Map<Snowflake, MusicVoteType>;
    private songQueue: Map<Snowflake, MusicQueueType>;

    public constructor(client: CommandoClient) {
        super(client, {
            name: 'skip',
            aliases: ['next'],
            group: 'music',
            memberName: 'skip',
            description: 'Skips the song that is currently playing.',
            details: 'If there are more than 3 people (not counting Red) a voteskip is started. Staff can force the skip by adding `force` to the command',
            examples: ['skip'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3,
            },
        });
        this.songVotes = this.votes;
        this.songQueue = this.queue;
    }

    private get queue() {
        if (!this.songQueue) {
            this.songQueue = (this.client.registry.resolveCommand('music:launch') as MusicCommand).queue;
        }

        return this.songQueue;
    }

    private get votes() {
        if (!this.songVotes) {
            this.songVotes = (this.client.registry.resolveCommand('music:launch') as MusicCommand).votes;
        }

        return this.songVotes;
    }

    public async run(msg: CommandMessage, args: string) {
        const queue = this.queue.get(msg.guild.id);
        if (!queue) return msg.reply('there isn\'t a song playing right now, silly.');
        if (!queue.voiceChannel.members.has(msg.author!.id)) return msg.reply('you\'re not in the voice channel. You better not be trying to mess with their mojo, man.');
        if (!queue.songs[0].dispatcher) return msg.reply('the song hasn\'t even begun playing yet. Why not give it a chance?');

        deleteCommandMessages(msg, this.client);

        return msg.reply(this.skip(msg.guild, queue));
    }

    private skip(guild: Guild, queue: MusicQueueType) {
        if (this.songVotes.get(guild.id)) {
            clearTimeout(this.songVotes.get(guild.id)!.timeout);
            this.songVotes.delete(guild.id);
        }
        if (!queue.songs[0].dispatcher) return 'hmmm... I couldn\'t find the music you were playing. You sure you did that correctly?';

        queue.songs[0].dispatcher.end();

        return `Skipped: **${queue.songs[0]}**`;
    }

    private setTimeout(vote: MusicVoteType) {
        const time = vote.start + 15000 - Date.now() + ((vote.count - 1) * 5000);

        clearTimeout(vote.timeout);
        vote.timeout = setTimeout(() => {
            this.songVotes.delete(vote.guild);
            vote.queue.textChannel.send('The vote to skip the current song has ended. Get outta here, party poopers.');
        }, time);

        return roundNumber(time / 1000);
    }
}