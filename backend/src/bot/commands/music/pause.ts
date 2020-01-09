/**
 * @file Music PauseSongCommand - Pauses the currently playing track
 *
 * You need to be in a voice channel before you can use this command
 *
 * **Aliases**: `shh`, `shhh`, `shhhh`, `shhhhh`, `hush`, `halt`
 * @module
 * @category music
 * @name pause
 */

import { deleteCommandMessages } from '../../components/Utils';
import { Command, CommandoClient, CommandMessage } from 'discord.js-commando';
import { Snowflake } from 'discord.js';
import { MusicCommand, MusicQueueType } from 'RedTypes';

export default class PauseSongCommand extends Command {
    private songQueue: Map<Snowflake, MusicQueueType>;

    public constructor(client: CommandoClient) {
        super(client, {
            name: 'pause',
            aliases: ['shh', 'shhh', 'shhhh', 'shhhhh', 'hush', 'halt'],
            group: 'music',
            memberName: 'pause',
            description: 'Pauses the currently playing song',
            examples: ['pause'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3,
            },
        });
        this.songQueue = this.queue;
    }

    private get queue() {
        if (!this.songQueue) {
            this.songQueue = (this.client.registry.resolveCommand('music:launch') as MusicCommand).queue;
        }

        return this.songQueue;
    }

    public async run(msg: CommandMessage) {
        const queue = this.queue.get(msg.guild.id);

        if (!queue) {
            deleteCommandMessages(msg, this.client);

            return msg.reply('I am not playing any music right now, why not get me to start something?');
        }
        if (!queue.songs[0].dispatcher) {
            deleteCommandMessages(msg, this.client);

            return msg.reply('I can\'t pause a song that hasn\'t even begun playing yet.');
        }
        if (!queue.songs[0].playing) {
            deleteCommandMessages(msg, this.client);

            return msg.reply('pauseception is not possible 🤔');
        }
        queue.songs[0].dispatcher.pause(true);
        queue.songs[0].playing = false;

        deleteCommandMessages(msg, this.client);

        return msg.reply(`paused the music. Use \`${msg.client.commandPrefix}resume\` to continue playing.`);
    }
}