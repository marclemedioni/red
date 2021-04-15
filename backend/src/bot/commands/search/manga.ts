import { INFO_EMBED_COLOR } from '../../components/Constants';
import { deleteCommandMessages } from '../../components/Utils';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Message, MessageEmbed } from 'discord.js';
import axios from "axios";

export default class MangaSearchCommand extends Command {
    public constructor(client: CommandoClient) {
        super(client, {
            name: 'manga',
            aliases: ['mang'],
            group: 'search',
            memberName: 'manga',
            description: 'Gets information about manga.',
            examples: ['<prefix>manga naruto'],
            guildOnly: false,
            args: [{key: 'name', type: 'string', prompt:'string'}],
            throttling: {
                usages: 2,
                duration: 3,
            },
        });
    }
    private async getInfo(name) {
        var query = `query ($id: Int, $search: String) {
                        Media (id: $id, type: MANGA, search: $search) {
                        id
                        title {
                            romaji
                            english
                            native
                        },
                        status,
                        volumes,
                        chapters,
                        isLicensed,
                        description,
                        bannerImage,
                        startDate{year, month, day},
                        endDate{year, month, day},
                        genres,
                        coverImage{
                            large
                            medium
                            },
                        }
                    }`;
        var variables = {search: name,};
        try {
            const response = await axios.post('https://graphql.anilist.co', {
              query,
              variables
            });
           return response.data.data
          } catch (error) {
            // If there's an error, set the error to the state
            console.log(error)
          }
        }

    
    public async run(msg: CommandoMessage, {name}) {
        const serverEmbed = new MessageEmbed(); 
        let info  = await this.getInfo(name)
        var logo = '✅';
        if(info.Media.isLicensed == false){
            logo = '❌';
        }
        if(info.Media.endDate.year == null){
            info.Media.endDate.year = '❓'
        }
        if(info.Media.volumes == null){
            info.Media.volumes = '❓'
        }
        if(info.Media.chapters == null){
            info.Media.chapters = '❓'
        }
    
        serverEmbed
        .setColor(INFO_EMBED_COLOR)
        .setAuthor("Manga Information")
        .addField('Romaji', info.Media.title.romaji, true)
        .addField('English', info.Media.title.english, true)
        .addField('Native', info.Media.title.native, true)
        .addField('Status', info.Media.status, true)
        .addField('Volumes', info.Media.volumes, true)
        .addField('Chapters', info.Media.chapters, true)
        .addField('Licensed', logo, true)
        .addField('Start Year', info.Media.startDate.year, true)
        .addField('End Year', info.Media.endDate.year, true)
        .addField('Genres', info.Media.genres.join(', ') )
        .addField('Description', info.Media.description.replace(/<[^>]*>/g, ''))
        .setThumbnail(info.Media.coverImage.medium)
        .setImage(info.Media.bannerImage);
        
            
        deleteCommandMessages(msg, this.client);

        return msg.embed(serverEmbed);
    }
}