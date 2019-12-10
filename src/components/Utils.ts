import { CommandoClient, CommandMessage, util as CommandoUtil } from 'discord.js-commando';
import { TextChannel, RichEmbed, PermissionString } from 'discord.js';

/** Helper function to delete command messages */
export const deleteCommandMessages = (msg: CommandMessage, client: CommandoClient) => {
    if (msg.deletable && client.provider.get(msg.guild, 'deletecommandmessages', false)) {
        msg.delete()
    };
};

/** Helper function to log moderation commands */
export const logModMessage = async (
    msg: CommandMessage, client: CommandoClient, outChannelID: string, outChannel: TextChannel, embed: RichEmbed
) => {
    if (!client.provider.get(msg.guild, 'hasSentModLogMessage', false)) {
        msg.reply(`
              📃 I can keep a log of moderator actions if you create a channel named \'mod-logs\'
              (or some other name configured by the ${client.commandPrefix}setmodlogs command) and give me access to it.
              This message will only show up this one time and never again after this so if you desire to set up mod logs make sure to do so now.`);
        client.provider.set(msg.guild, 'hasSentModLogMessage', true);
    }

    return outChannelID && client.provider.get(msg.guild, 'modlogs', false)
        ? outChannel.send('', { embed })
        : null;
};

/** Decorator function that checks if the user and the client have the required permissions */
export const shouldHavePermission = (permission: PermissionString, shouldClientHavePermission = false): MethodDecorator => {
    return (target: unknown, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        const fn: (...args: unknown[]) => unknown = descriptor.value;

        descriptor.value = async function value(msg: CommandMessage, args: object, fromPattern: boolean) {
            const authorIsOwner = msg.client.isOwner(msg.author!);
            const memberHasPermission = msg.member!.hasPermission(permission);

            if (!memberHasPermission && !authorIsOwner) {
                return onBlock(msg, 'permission',
                    { response: `You need the "${CommandoUtil.permissions[permission]}" permission to use the ${msg.command.name} command` });
            }

            if (shouldClientHavePermission) {
                const clientHasPermission = (msg.channel as TextChannel).permissionsFor(msg.client.user!)!.has(permission);

                if (!clientHasPermission) {
                    return onBlock(msg, 'clientPermissions', { missing: [permission] });
                }
            }

            return fn.apply(this, [msg, args, fromPattern]);
        };

        return descriptor;
    };
};

export const onBlock = (message, reason, data) => {
    switch (reason) {
        case 'guildOnly':
            return message.reply(`The \`${this.name}\` command must be used in a server channel.`);
        case 'nsfw':
            return message.reply(`The \`${this.name}\` command can only be used in NSFW channels.`);
        case 'permission': {
            if (data.response) return message.reply(data.response);
            return message.reply(`You do not have permission to use the \`${this.name}\` command.`);
        }
        case 'clientPermissions': {
            if (data.missing.length === 1) {
                return message.reply(
                    `I need the "${CommandoUtil.permissions[data.missing[0]]}" permission for the \`${this.name}\` command to work.`
                );
            }
            return message.reply(`
                I need the following permissions for the \`${this.name}\` command to work:
                ${data.missing.map(perm => CommandoUtil.permissions[perm]).join(', ')}
            `);
        }
        case 'throttling': {
            return message.reply(
                `You may not use the \`${this.name}\` command again for another ${data.remaining.toFixed(1)} seconds.`
            );
        }
        default:
            return null;
    }
}