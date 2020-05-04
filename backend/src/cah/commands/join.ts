import { Command, CommandoClient, CommandMessage } from "discord.js-commando";
import { stripIndents } from "common-tags";
import { Attachment, RichEmbed } from "discord.js";
import path from 'path';

/**
 * @file CAH JoinCommand - Join CAH game
 *
 * @module
 * @category cah
 * @name join
 */

export default class EndGameZombiesCommand extends Command {
    public constructor(client: CommandoClient) {
        super(client, {
            name: 'cahjoin',
            aliases: [],
            group: 'cah',
            memberName: 'join',
            description: 'Join a CAH game',
            examples: ['cahjoin'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3,
            },
        });
    }

    public async run(msg: CommandMessage) {
        return msg.reply(undefined);
    }
}