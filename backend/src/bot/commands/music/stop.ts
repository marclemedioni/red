/**
 * @file Music StopMusicCommand - Stops the current queue. Bot will automatically leave the channel after this command
 *
 * A vote to skip is started if there are 4 or more people in the voice channel with `(amount of members) / 3` as
 *     required amount of votes (bot doesn't count as a member). Staff that can delete messages can force the skip by
 *     using `skip force`. You need to be in a voice channel before you can use this command.
 *
 * **Aliases**: `kill`, `stfu`, `quit`, `leave`, `disconnect`
 * @module
 * @category music
 * @name stop
 */

import { deleteCommandMessages, roundNumber } from '../../components/Utils';
import { Command, CommandoClient, CommandMessage } from 'discord.js-commando';
import { Snowflake, Guild } from 'discord.js';
import { oneLine } from 'common-tags';
import { MusicCommand, MusicQueueType, MusicVoteType } from 'RedTypes';

export default class StopMusicCommand extends Command {
    private songVotes: Map<Snowflake, MusicVoteType>;
    private songQueue: Map<Snowflake, MusicQueueType>;

    public constructor(client: CommandoClient) {
        super(client, {
            name: 'stop',
            aliases: ['kill', 'stfu', 'quit', 'leave', 'disconnect'],
            group: 'music',
            memberName: 'stop',
            description: 'Stops the music and wipes the queue.',
            details: oneLine`
                If there are more than 3 people (not counting Red) a votestop is started.
                Staff can force the stop by adding \`force\` to the command
              `,
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

        if (!queue) return msg.reply('there isn\'t any music playing right now.');
        if (!queue.voiceChannel.members.has(msg.author!.id)) {
            return msg.reply('you\'re not in the voice channel. They really don\'t want you to mess up their vibe man.');
        }
        if (!queue.songs[0].dispatcher) return msg.reply('the song hasn\'t even begun playing yet. Why not give it a chance?');

        deleteCommandMessages(msg, this.client);

        queue.isTriggeredByStop = true;
        this.queue.set(msg.guild.id, queue);

        return msg.reply(this.stop(msg.guild, queue));
    }

    private stop(guild: Guild, queue: MusicQueueType) {
        if (this.songVotes.has(guild.id)) {
            clearTimeout(this.songVotes.get(guild.id)!.timeout);
            this.songVotes.delete(guild.id);
        }

        const song = queue.songs[0];

        queue.songs = [];
        if (song.dispatcher) {
            song.dispatcher.end();
        }

        return 'you\'ve just killed the party. Congrats 🎉';
    }
}