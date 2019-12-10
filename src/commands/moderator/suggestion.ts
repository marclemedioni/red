import { INFO_EMBED_COLOR } from '../../components/Constants';
import { deleteCommandMessages } from '../../components/Utils';
import { Command, CommandoClient, CommandMessage } from 'discord.js-commando';
import { RichEmbed } from 'discord.js';


export default class SuggestionModeratorCommand extends Command {
    public constructor(client: CommandoClient) {
        super(client, {
            name: 'suggestion',
            aliases: ['sug'],
            group: 'moderator',
            memberName: 'suggestion',
            description: 'Add Suggestion for Discord Server',
            examples: ['<prefix>suggestion Add new channel for comments'],
            guildOnly: true,
            //args: [{key: 'description', type: 'string', prompt:'string'}],
        });
    }

    private async  verif(msg: CommandMessage) {
        const channel = msg.guild.channels.find('name', 'suggestion');
        if(channel == null){
           return await this.createChan(msg)
        }
        return channel;
    }
    private createChan(msg: CommandMessage){
        var channel =   msg.guild.createChannel('suggestion', {type:'text'})
        return channel;
        
    }
    

    
    public async run(msg: CommandMessage, {description}) {
        const channel = await this.verif(msg);
        var chan = msg.guild.channels.get(channel.id);  
        chan!.send('fffff')  
        console.log(channel)
    
       
        //console.log(chan)
        return msg.say(channel.id);
    }
}