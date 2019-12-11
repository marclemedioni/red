import { Command, CommandoClient, CommandMessage } from "discord.js-commando";
import { bus } from '../bus';
import { gameCreate } from "../events";
import { stripIndents } from 'common-tags';
import { RichEmbed, Message } from "discord.js";

/**
 * @file Zombies NewGameCommand - Launch a new Zombies game
 *
 * **Aliases**: `ng`
 * @module
 * @category zombies
 * @name newgame
 */

const LOBBY_DELAY = 5 * 1000;

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
        if (msg.client.provider.get(msg.guild, 'zombies', false)) {
            return msg.reply(stripIndents`y a déjà une partie en cours pov' tâche`);
        }

        this.client.provider.set(msg.guild, 'zombies', {});

        const yes = '👍';
        const no = '👎';
        let embedMessage = `${msg.author.username} se sent d'humeur aventureuse et propose une partie de Zombies, ça vous tente ?`;

        const embed = new RichEmbed()
            .setAuthor(embedMessage)
            .setColor('RED');

        const sentMessage = (await msg.channel.send(embed)) as Message

        await sentMessage.react(yes)
        await sentMessage.react(no)

        const reactions = await sentMessage.awaitReactions(
            r => r.emoji.name === yes,
            {
                time: LOBBY_DELAY
            }
        );

        const upToplay = reactions.get(yes);

        if (!upToplay || upToplay.count < 1) {
            embed.setAuthor(stripIndents`${embedMessage} 
                Ou pas...
            `)
            await sentMessage.clearReactions();
            this.client.provider.remove(msg.guild, 'zombies')
            return sentMessage.edit(embed);
        }

        const users = upToplay.users.filter(user => user.id !== this.client.user.id);

        embed.setAuthor(stripIndents`${embedMessage} 

            Nous avons ${users.size} volontaires pour souffrir c'est parti !

            Les participants sont:
            ${users.map(user => `• ${msg.guild.members.get(user.id)!.displayName}`).join('\n')}
        `)
        await sentMessage.clearReactions();

        bus.publish(gameCreate({ guild: msg.guild, players: users.map(user => ({ id: user.id, username: user.username })) }));
        return sentMessage.edit(embed)
    }
}