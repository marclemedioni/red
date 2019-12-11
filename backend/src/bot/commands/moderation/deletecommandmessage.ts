/**
 * @file Moderation DeleteCommandMessagesCommand - Configure whether Red should delete command messages
 *
 * **Aliases**: `dcm`
 * @module
 * @category moderation
 * @name deletecommandmessages
 * @example deletecommandmessages enable
 * @param {boolean} Option True or False
 */

import { deleteCommandMessages, logModMessage, shouldHavePermission } from '../../components/Utils';
import { Command, CommandoClient, CommandMessage } from 'discord.js-commando';
import { TextChannel, RichEmbed } from 'discord.js';
import { oneLine } from 'common-tags';

interface DeleteCommandMessagesArgs {
    shouldEnable: boolean;
}

export default class DeleteCommandMessagesCommand extends Command {
    public constructor(client: CommandoClient) {
        super(client, {
            name: 'deletecommandmessages',
            aliases: ['dcm'],
            group: 'moderation',
            memberName: 'deletecommandmessages',
            description:
                'Configure whether Red should delete command messages',
            format: 'boolean',
            examples: ['deletecommandmessages enable'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3,
            },
            args: [
                {
                    key: 'shouldEnable',
                    prompt: 'Enable or disable deleting of command messages?',
                    type: 'boolean',
                }
            ],
        });
    }

    @shouldHavePermission('MANAGE_MESSAGES', true)
    public async run(msg: CommandMessage, { shouldEnable }: DeleteCommandMessagesArgs) {
        const dcmEmbed = new RichEmbed();
        const modlogChannel = msg.client.provider.get(msg.guild, 'modlogchannel', null);

        msg.client.provider.set(msg.guild, 'deletecommandmessages', shouldEnable);

        dcmEmbed
            .setColor('#3DFFE5')
            .setAuthor(msg.author!.tag, msg.author!.displayAvatarURL)
            .setDescription(oneLine`**Action:** Deleting of command messages is now ${shouldEnable ? 'enabled' : 'disabled'}`)
            .setTimestamp();

        if (msg.client.provider.get(msg.guild, 'modlogs', true)) {
            logModMessage(
                msg, msg.client, modlogChannel, msg.guild.channels.get(modlogChannel) as TextChannel, dcmEmbed
            );
        }

        deleteCommandMessages(msg, this.client);

        return msg.embed(dcmEmbed);
    }
}