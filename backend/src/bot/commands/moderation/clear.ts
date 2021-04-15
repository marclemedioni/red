import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

export default class ClearModeratorCommand extends Command {
    public constructor(client: CommandoClient) {
        super(client, {
            name: 'clear',
            group: 'moderation',
            memberName: 'clear',
            description: 'Clear channel discord',
            examples: ['<prefix>clear <number | @Mention | name >'],
            guildOnly: true,
            args: [{key: 'data', type: 'string', prompt:' <number | @Mention | name >',}],
        });
    }
    private async supMessage(msg , id){
        let valeur;
        await msg.channel.fetchMessages()
            .then(function(messages){ 
                var selection = messages.filter(m => m.author.id === id)
                selection.deleteAll()
                valeur = selection.size
            })
        return valeur;

    }


    public async run(msg: CommandoMessage, { data }) {
        var msgDelete;
        var s = '';
        var mention = msg.mentions.members?.first();
        var user = await (await msg.guild.members.fetch({ query: data, limit: 1 })).first();
        if(!isNaN(data)){
            if (msg.channel.type === 'text') {
                msg.channel.bulkDelete(data);
                msgDelete = data;
            }
        }else{
            if(user != null){
                msgDelete = await this.supMessage(msg, user.id)
                
            }else if(mention){
                msgDelete = await this.supMessage(msg, mention.id)
            }else{
                msgDelete = "Oups! Not Found"
            }
        }
        if(msgDelete > 1){
            s ='s'
        }  
        if(!isNaN(msgDelete)){
            msgDelete = '✅ ' + msgDelete + " Message"+s+" Deleted"
        }else{
            msgDelete = '❗ ' + msgDelete
        }


        return msg.say(msgDelete);
    }
}