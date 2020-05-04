import { Command, CommandoClient, CommandMessage } from "discord.js-commando";
import { stripIndents } from "common-tags";
import { Attachment, RichEmbed } from "discord.js";
import path from 'path';

/**
 * @file CAH StartCommand - Start CAH game
 *
 * @module
 * @category cah
 * @name join
 */

export default class StartCAHCommand extends Command {
    public constructor(client: CommandoClient) {
        super(client, {
            name: 'cahstart',
            aliases: [],
            group: 'cah',
            memberName: 'start',
            description: 'start a CAH game',
            examples: ['cahstart'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3,
            },
        });
    }

    public async run(msg: CommandMessage) {
        const cah = this.client.provider.get(msg.guild, 'cah');

        if (cah.state !== 'stopped') {
            return msg.channel.send('Game already in progress')
        }
        
        cah.state = 'lobby';
        this.client.provider.set(msg.guild, 'cah', cah);
        
        return msg.reply('start')
    }
}