import { DEFAULT_EMBED_COLOR } from '../../components/Constants';
import { deleteCommandMessages, shouldHavePermission } from '../../components/Utils';
import { Command, CommandoClient, CommandMessage } from 'discord.js-commando';
import { RichEmbed, TextChannel } from 'discord.js';
import { KeyObject } from 'crypto';


export default class SuggestionModeratorCommand extends Command {
    public constructor(client: CommandoClient) {
        super(client, {
            name: 'suggestion',
            aliases: ['sug'],
            group: 'moderation',
            memberName: 'suggestion',
            description: 'Add Suggestion for Discord Server',
            examples: ['<prefix>suggestion Add new channel for comments'],
            guildOnly: true,
            args: [{ key: 'description', type: 'string', prompt: 'string' }],
        });
    }



    private async  verif(msg: CommandMessage) {
        const channel = msg.guild.channels.find('name', 'suggestion');
        if (channel == null) {
            return await this.createChan(msg)
        }
        return channel;
    }
    private createChan(msg: CommandMessage) {
        var channel = msg.guild.createChannel('suggestion', { type: 'text' })
        return channel;

    }
    @shouldHavePermission('MANAGE_MESSAGES', true)

    public async run(msg: CommandMessage, { description }) {
        const channel = await this.verif(msg);
        const chan = msg.guild.channels.get(channel.id) as TextChannel;
        const serverEmbed = new RichEmbed();

        serverEmbed
            .setColor(DEFAULT_EMBED_COLOR)
            .setAuthor(msg.member.displayName, msg.author.avatarURL)
            .setDescription(description)
            .setTimestamp()


        var message = await chan!.sendEmbed(serverEmbed);
        message.react('✅');
        message.react('❌');

        deleteCommandMessages(msg, this.client);
        return msg.channel.send("✅  Suggestion has been Added");;
    }
}