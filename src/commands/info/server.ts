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
import { Command, CommandoClient, CommandMessage } from 'discord.js-commando';
import { Role, RichEmbed } from 'discord.js';
import moment from 'moment';
import { ENGINE_METHOD_DIGESTS } from 'constants';

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

    private static contentFilter(filter: number) {
        switch (filter) {
            case 0:
                return 'Content filter disabled';
            case 1:
                return 'Scan messages of members without a role';
            case 2:
                return 'Scan messages sent by all members';
            default:
                return 'Content Filter unknown';
        }
    }

    private static verificationFilter(filter: number) {
        switch (filter) {
            case 0:
                return 'None - unrestricted';
            case 1:
                return 'Low - must have verified email on account';
            case 2:
                return 'Medium - must be registered on Discord for longer than 5 minutes';
            case 3:
                return 'High - (╯°□°）╯︵ ┻━┻ - must be a member of the server for longer than 10 minutes';
            case 4:
                return 'Very High - ┻━┻ミヽ(ಠ益ಠ)ﾉ彡┻━┻ - must have a verified phone number';
            default:
                return 'Verification Filter unknown';
        }
    }

    public async run(msg: CommandMessage) {
        const channels = msg.guild.channels.map(ty => ty.type);
        const presences = msg.guild.presences.map(st => st.status);
        const selfRoles = msg.guild.roles;
        const serverEmbed = new RichEmbed();

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
            .setThumbnail(msg.guild.iconURL)
            .setFooter(`Server ID: ${msg.guild.id}`)
            .addField('Server Name', msg.guild.name, true)
            .addField('Owner', msg.guild.owner ? msg.guild.owner.user.tag : 'Owner is MIA', true)
            .addField('Members', msg.guild.memberCount, true)
            .addField('Currently Online', onlineMembers, true)
            .addField('Region', msg.guild.region, true)
            .addField('Highest Role', msg.guild.roles.sort((a: Role, b: Role) => a.position - b.position).last()!.name, true)
            .addField('Number of emojis', msg.guild.emojis.size, true)
            .addField('Number of roles', msg.guild.roles.size, true)
            .addField('Number of channels', guildChannels, true)
            .addField('Created At', moment(msg.guild.createdTimestamp).format('MMMM Do YYYY [at] HH:mm:ss [UTC]Z'), false)
            .addField('Verification Level', ServerInfoCommand.verificationFilter(msg.guild.verificationLevel), false)
            .addField('Explicit Content Filter', ServerInfoCommand.contentFilter(msg.guild.explicitContentFilter), false);

        if (selfRoles) {
            serverEmbed.addField('Self-Assignable Roles',
                `${selfRoles.map(val => `\`${val.name}\``).join(', ')}`,
                false);
        }

        if (msg.guild.splashURL) {
            serverEmbed.setImage(msg.guild.splashURL);
        }

        deleteCommandMessages(msg, this.client);

        return msg.embed(serverEmbed);
    }
}