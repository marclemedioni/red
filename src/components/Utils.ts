import { CommandoClient, CommandMessage, util as CommandoUtil } from 'discord.js-commando';
import { TextChannel, RichEmbed, PermissionString, Util, GuildMember, StreamDispatcher } from 'discord.js';
import { oneLineTrim } from 'common-tags';
import { YoutubeVideoType } from 'RedTypes';

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

/** Helper function to properly round up or down a number */
export const roundNumber = (num: number, scale = 0) => {
    if (!num.toString().includes('e')) {
        return Number(`${Math.round(Number(`${num}e+${scale}`))}e-${scale}`);
    }
    const arr = `${num}`.split('e');
    let sig = '';

    if (Number(arr[1]) + scale > 0) {
        sig = '+';
    }

    return Number(`${Math.round(Number(`${Number(arr[0])}e${sig}${Number(arr[1]) + scale}`))}e-${scale}`);
};

/** Song class used in music commands to track the song data */
export class Song {
    public name: string;
    public id: string;
    public length: number;
    public member: GuildMember;
    public dispatcher: StreamDispatcher | null;
    public playing: boolean;

    public constructor(video: YoutubeVideoType, member: GuildMember) {
        this.name = Util.escapeMarkdown(video.title);
        this.id = video.id;
        this.length = video.durationSeconds;
        this.member = member;
        this.dispatcher = null;
        this.playing = false;
    }

    public get url() {
        return `https://www.youtube.com/watch?v=${this.id}`;
    }

    public get thumbnail() {
        return `https://img.youtube.com/vi/${this.id}/mqdefault.jpg`;
    }

    public get username() {
        return Util.escapeMarkdown(`${this.member.user.tag} (${this.member.user.id})`);
    }

    public get avatar() {
        return `${this.member.user.displayAvatarURL}`;
    }

    public get lengthString() {
        return Song.timeString(this.length);
    }

    public static timeString(seconds: number, forceHours = false) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        return oneLineTrim`
       ${forceHours || hours >= 1 ? `${hours}:` : ''}
       ${hours >= 1 ? `0${minutes}`.slice(-2) : minutes}:
       ${`0${Math.floor(seconds % 60)}`.slice(-2)}
      `;
    }

    public timeLeft(currentTime: number) {
        return Song.timeString(this.length - currentTime);
    }

    public toString() {
        return `${this.name} (${this.lengthString})`;
    }
}