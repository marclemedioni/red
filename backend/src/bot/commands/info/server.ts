/**
 * @file Info ServerInfoCommand - Gets information about the current server
 *
 * **Aliases**: `serverinfo`, `sinfo`
 * @module
 * @category info
 * @name server
 */

import { DEFAULT_EMBED_COLOR } from '../../components/Constants';
import { deleteCommandMessages } from '../../components/Utils';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Role, MessageEmbed } from 'discord.js';
import moment from 'moment';

export default class ServerInfoCommand extends Command {
    public constructor(client: CommandoClient) {
        super(client, {
            name: 'server',
            aliases: ['serverinfo', 'sinfo'],
            group: 'info',
            memberName: 'server',
            description: 'Gets information about the server.',
            examples: ['server'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3,
            },
        });
    }

    private static contentFilter(filter: string) {
        switch (filter) {
            case 'DISABLED':
                return 'Content filter disabled';
            case 'MEMBERS_WITHOUT_ROLES':
                return 'Scan messages of members without a role';
            case 'ALL_MEMBERS':
                return 'Scan messages sent by all members';
            default:
                return 'Content Filter unknown';
        }
    }

    private static verificationFilter(filter: string) {
        switch (filter) {
            case 'NONE':
                return 'None - unrestricted';
            case 'LOW':
                return 'Low - must have verified email on account';
            case 'MEDIUM':
                return 'Medium - must be registered on Discord for longer than 5 minutes';
            case 'HIGH':
                return 'High - (╯°□°）╯︵ ┻━┻ - must be a member of the server for longer than 10 minutes';
            case 'VERY_HIGH':
                return 'Very High - ┻━┻ミヽ(ಠ益ಠ)ﾉ彡┻━┻ - must have a verified phone number';
            default:
                return 'Verification Filter unknown';
        }
    }

    public async run(msg: CommandoMessage) {
        const channels = msg.guild.channels.cache.map(ty => ty.type);
        const presences = msg.guild.presences.cache.map(st => st.status);
        const selfRoles = msg.guild.roles;
        const serverEmbed = new MessageEmbed();

        let guildChannels = 0;
        let onlineMembers = 0;

        for (const presence of presences) {
            if (presence !== 'offline') onlineMembers += 1;
        }

        for (const channel of channels) {
            if (channel === 'text') guildChannels += 1;
        }

        serverEmbed
            .setColor(DEFAULT_EMBED_COLOR)
            .setAuthor('Server Info')
            .setThumbnail(msg.guild.iconURL() || '')
            .setFooter(`Server ID: ${msg.guild.id}`)
            .addField('Server Name', msg.guild.name, true)
            .addField('Owner', msg.guild.owner ? msg.guild.owner.user.tag : 'Owner is MIA', true)
            .addField('Members', msg.guild.memberCount, true)
            .addField('Currently Online', onlineMembers, true)
            .addField('Region', msg.guild.region, true)
            .addField('Highest Role', msg.guild.roles.cache.sort((a: Role, b: Role) => a.position - b.position).last()!.name, true)
            .addField('Number of emojis', msg.guild.emojis.cache.size, true)
            .addField('Number of roles', msg.guild.roles.cache.size, true)
            .addField('Number of channels', guildChannels, true)
            .addField('Created At', moment(msg.guild.createdTimestamp).format('MMMM Do YYYY [at] HH:mm:ss [UTC]Z'), false)
            .addField('Verification Level', ServerInfoCommand.verificationFilter(msg.guild.verificationLevel), false)
            .addField('Explicit Content Filter', ServerInfoCommand.contentFilter(msg.guild.explicitContentFilter), false);

        if (selfRoles) {
            serverEmbed.addField('Self-Assignable Roles',
                `${selfRoles.cache.map(val => `\`${val.name}\``).join(', ')}`,
                false);
        }

        if (msg.guild.splashURL) {
            serverEmbed.setImage(msg.guild.splashURL() || '');
        }

        deleteCommandMessages(msg, this.client);

        return msg.embed(serverEmbed);
    }
}