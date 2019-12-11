import { Command, CommandoClient, CommandMessage } from "discord.js-commando";
import { bus } from '../bus';
import { gameDestroy } from "../events";
import { stripIndents } from "common-tags";

/**
 * @file Zombies EndGameCommand - Destroy a Zombies game
 *
 * **Aliases**: `eg`
 * @module
 * @category zombies
 * @name endgame
 */

export default class EndGameZombiesCommand extends Command {
    public constructor(client: CommandoClient) {
        super(client, {
            name: 'endgame',
            aliases: ['eg'],
            group: 'zombies',
            memberName: 'endgame',
            description: 'Destroy a Zombies game.',
            examples: ['endgame'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3,
            },
        });
    }

    public async run(msg: CommandMessage) {
        if (msg.client.provider.get(msg.guild, 'zombies', false)) {
            bus.publish(gameDestroy({ guild: msg.guild }));
            return msg.reply(stripIndents`
                a appuyé sur bouton rouge et à détruit tout les zombies d'un seul coup !
            `);
        }

        return msg.reply(stripIndents`
            y a pas de partie en cours pov' tâche !
       `)
    }
}