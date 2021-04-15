import { DEFAULT_EMBED_COLOR } from '../../components/Constants';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { deleteCommandMessages, shouldHavePermission } from '../../components/Utils';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import Axios from 'axios';

export default class EventModeratorCommand extends Command {
    public constructor(client: CommandoClient) {
        super(client, {
            name: 'event',
            group: 'moderation',
            memberName: 'event',
            description: 'Add new event',
            examples: ['<prefix>event 08/02 20:05 garticphone'],
            guildOnly: true,
            args: [{key: 'date', type: 'string', prompt: 'date (example: dd/MM/yyyy)', validate: text => {
                if(this.verifDate(text)) return true
                return "date format is dd/MM/yyyy"
            }},
                    {key: 'heure', type: 'string', prompt: 'hour (example 20:41)', validate:text => {
                if(this.verifHour(text)) return true
                return "Hour format is h:mm"
                    }},
                    {key: 'game', type: 'string', prompt: 'game (name game)'}],
        });
    }

    private async verif(msg: CommandoMessage) {
        const category = msg.guild.channels.cache.find(c => c.name == 'Calendar' && c.type == 'category');
        if (category == null) {
           const category = await (await this.createChan(msg, 'category', 'Calendar'))
           const channel = await (await this.createChan(msg, 'text', 'event')).setParent(category.id)
        }

        const channel = msg.guild.channels.cache.find((channel => {
            return channel.name === 'event'
        }));
        if (channel == null && category) {
            const channel = await (await this.createChan(msg, 'text', 'event')).setParent(category.id)
        }
        return channel;
    }
    private verifDate(date: string){
        var date_regex = /^(?:(?:31(\/)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
        return date_regex.test(date)
    }
    private verifHour(hour: string){
        var regex = RegExp('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$');
        return regex.test(hour)
    }
    private createChan(msg: CommandoMessage, type, name) {
        var channel = msg.guild.channels.create(name, { type })
        return channel;
    }
    private makeSortString (s) {
        var translate_re = /[^0-9 +]/g;
        return ( s.replace(translate_re, function(match) { 
           return  match = ":regional_indicator_"+match.toLowerCase()+":"
        }));
    }
    private async getImage(name: string): Promise<string > {
        try {
            const response = await Axios.get('https://api.qwant.com/api/search/images',{
                params:{
                    'count': 1,
                    'q': name,
                    't': 'images',
                    'safesearch': 1,
                    'uiv':1,
                },
                headers:{
                    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:69.0) Gecko/20100101 Firefox/69.0',
                }
            });
            const image = response.data.data.result.items[0].media;

            return image;
        } catch (err) {
            return 'null';
        }
    }


    @shouldHavePermission('MANAGE_MESSAGES', true)

    public async run(msg: CommandoMessage, { date, heure, game }) {
        const channel = await this.verif(msg);
        if (!channel) {
            return msg.channel.send('Unable to determine channel to create');
        }
        const chan = msg.guild.channels.cache.get(channel.id) as TextChannel;
        const serverEmbed = new MessageEmbed();
        let nbrPlayers = 0
        let players = new Array()
        let image = await this.getImage(game)
        serverEmbed
            .setColor(DEFAULT_EMBED_COLOR)
            .setAuthor(msg.member?.displayName, msg.author.avatarURL() || '')
            .setDescription(this.makeSortString(game))
            .addField(':bust_in_silhouette: ' +nbrPlayers ,'\u200B', true)
            .addField(':date: '+ date , '\u200B', true)
            .addField(':clock9: '+ heure, '\u200B', true)
            .setFooter("✅ Accepted | 🚫 Not interested | 🕒 late | ❌ refuse", '')
            .setImage(image)
            .setTimestamp()
        var message = await chan.send(serverEmbed)
        await message.react('✅')
        await message.react('🚫')
        await message.react('🕒')
        await message.react('❌')
        
        const collector = message.createReactionCollector((r, user) =>['✅','🚫','🕒','❌'].includes(r.emoji.name) && user.id !== message.author.id, {})
        collector.on('collect', r => {
            let user = r.users.cache.last()
            let player = players.map((e)=>{return e.user}).indexOf(user?.username)
            if(r.emoji.name === '✅' || r.emoji.name === '🕒'){
                if(player === -1){
                    nbrPlayers++;
                }else{
                    if(players[player].etat === '✅' || players[player].etat === '🕒'){                     
                        //et maintenant tu fais plus rien !!!!!!!!!!!!!
                    }else{
                        nbrPlayers++;
                    }
                }
            }
            else if(r.emoji.name === '🚫' || r.emoji.name === '❌'){
                if(player !== -1){
                    if(players[player].etat === '✅' || players[player].etat === '🕒'){                     
                        nbrPlayers--;
                    }
                }
            }
            if(player === -1){
                players[nbrPlayers] = {'id': nbrPlayers, 'user':user?.username, 'etat': r.emoji.name, 'colums': serverEmbed.fields?.length }
                serverEmbed.addField(r.emoji.name+' '+user?.username, '\u200B', true)
            }else{
                players[player].etat = r.emoji.name
                if(serverEmbed.fields) serverEmbed.fields[players[player].colums].name = r.emoji.name+' '+user?.username
            }
            message.reactions.cache.get(r.emoji.name)?.remove()
            if(serverEmbed.fields) serverEmbed.fields[0].name = ':bust_in_silhouette: ' +nbrPlayers;
            message.edit(serverEmbed)
        });
           
        collector.on('end', collected => message.reactions.removeAll());
        deleteCommandMessages(msg, this.client);
        
        return msg.channel.send("✅  Event has been Added");;
    }
}