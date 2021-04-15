/**
 * @file Moderation ModLogsCommand - Toggle mod logs in the configured channel
 *
 * **Aliases**: `togglemod`
 * @module
 * @category moderation
 * @name modlogs
 * @example modlogs enable
 * @param {boolean} Option True or False
 * @param {TextChannel} [Channel] TextChannel the Mod Logs are sent to, required when enabling
 */

import { deleteCommandMessages, logModMessage, shouldHavePermission } from '../../components/Utils';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { MessageEmbed, TextChannel } from 'discord.js';
import { oneLine, stripIndents } from 'common-tags';
import moment from 'moment';

interface ModLogsArgs {
    shouldEnable: boolean;
    msgChannel: TextChannel | string;
}

export default class ModLogsCommand extends Command {
    public constructor(client: CommandoClient) {
        super(client, {
            name: 'modlogs',
            aliases: ['togglemod'],
            group: 'moderation',
            memberName: 'modlogs',
            description: 'Toggle mod logs in the configured channel',
            format: 'boolean',
            examples: ['modlogs {option}', 'modlogs enable'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3,
            },
            args: [
                {
                    key: 'shouldEnable',
                    prompt: 'Enable or disable modlogs?',
                    type: 'boolean',
                },
                {
                    key: 'msgChannel',
                    prompt: 'In which channel should I output modlogs?',
                    type: 'channel',
                    default: 'off',
                }
            ],
        });
    }

    @shouldHavePermission('ADMINISTRATOR')
    public async run(msg: CommandoMessage, { shouldEnable, msgChannel }: ModLogsArgs) {
        try {
            if (shouldEnable && msgChannel === 'off') {
                return msg.reply('when activating join messages you need to provide a channel for me to output the messages to!');
            }

            const description = shouldEnable
                ? '📥 modlogs have been enabled'
                : '📤 modlogs have been disabled';
            const modlogChannel = (msg.client as CommandoClient).provider.get(msg.guild, 'modlogchannel', null);
            const modlogsEmbed = new MessageEmbed()
                .setColor('#3DFFE5')
                .setAuthor(msg.author!.tag, msg.author.displayAvatarURL())
                .setDescription(`**Action:** ${description}`)
                .setTimestamp();

            (msg.client as CommandoClient).provider.set(msg.guild, 'modlogs', shouldEnable);

            if (this.isChannel(msgChannel)) {
                (msg.client as CommandoClient).provider.set(msg.guild, 'modlogchannel', msgChannel.id);
                modlogsEmbed.description += `\n${shouldEnable ? `**Channel:** <#${msgChannel.id}>` : ''}`;
            }

            if ((msg.client as CommandoClient).provider.get(msg.guild, 'modlogs', true)) {
                logModMessage(
                    msg, (msg.client as CommandoClient), modlogChannel, msg.guild.channels.cache.get(modlogChannel) as TextChannel, modlogsEmbed
                );
            }

            deleteCommandMessages(msg, this.client);

            return msg.embed(modlogsEmbed);
        } catch (err) {
            deleteCommandMessages(msg, this.client);
            const channel = this.client.channels.cache.get(process.env.ISSUE_LOG_CHANNEL_ID!) as TextChannel;

            channel.send(stripIndents`
        <@${this.client.owners[0].id}> Error occurred in \`memberlogs\` command!
        **Server:** ${msg.guild.name} (${msg.guild.id})
        **Author:** ${msg.author!.tag} (${msg.author!.id})
        **Time:** ${moment(msg.createdTimestamp).format('MMMM Do YYYY [at] HH:mm:ss [UTC]Z')}
        **Error Message:** ${err}`);

            return msg.reply(oneLine`
        an unknown and unhandled error occurred but I notified ${this.client.owners[0].username}.
        Want to know more about the error?
        Join the support server by getting an invite by using the \`${(msg.client as CommandoClient).commandPrefix}invite\` command`);
        }
    }

    private isChannel(channel: TextChannel | string): channel is TextChannel {
        return (channel as TextChannel).id !== undefined;
    }
}