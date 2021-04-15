import { DEFAULT_EMBED_COLOR } from '../../components/Constants';
import { deleteCommandMessages, shouldHavePermission } from '../../components/Utils';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { MessageEmbed, TextChannel } from 'discord.js';
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



    private async  verif(msg: CommandoMessage) {
        const channel = msg.guild.channels.cache.find(channel => {
            return channel.name ===  'suggestion'
        });
        if (channel == null) {
            return await this.createChan(msg)
        }
        return channel;
    }
    private createChan(msg: CommandoMessage) {
        var channel = msg.guild.channels.create('suggestion', { type: 'text' })
        return channel;

    }
    @shouldHavePermission('MANAGE_MESSAGES', true)

    public async run(msg: CommandoMessage, { description }) {
        const channel = await this.verif(msg);
        const chan = msg.guild.channels.cache.get(channel.id) as TextChannel;
        const serverEmbed = new MessageEmbed();

        serverEmbed
            .setColor(DEFAULT_EMBED_COLOR)
            .setAuthor(msg.member?.displayName, msg.author.avatarURL() || '')
            .setDescription(description)
            .setTimestamp()


        var message = await chan!.send(serverEmbed);
        message.react('✅');
        message.react('❌');

        deleteCommandMessages(msg, this.client);
        return msg.channel.send("✅  Suggestion has been Added");;
    }
}