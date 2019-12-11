import { Command, CommandoClient, CommandMessage } from "discord.js-commando";
import { bus } from '../bus';
import { gameCreate } from "../events";
import { stripIndents } from 'common-tags';

/**
 * @file Zombies NewGameCommand - Launch a new Zombies game
 *
 * **Aliases**: `ng`
 * @module
 * @category zombies
 * @name newgame
 */

export default class NewGameZombiesCommand extends Command {
    public constructor(client: CommandoClient) {
        super(client, {
            name: 'newgame',
            aliases: ['ng'],
            group: 'zombies',
            memberName: 'newgame',
            description: 'Launch a new Zombies game.',
            examples: ['newgame'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3,
            },
        });
    }

    public async run(msg: CommandMessage) {
        bus.publish(gameCreate({ guild: msg.guild }));
        return msg.reply(stripIndents`
            se sent d'humeur aventureuse et propose une partie de Zombies
        `);
    }
}