/**
 * @file search Animes - Gets information about animes
 *
 * **Aliases**: `anim`
 * @module
 * @category search
 * @name animes
 */

import { INFO_EMBED_COLOR } from '../../components/Constants';
import { deleteCommandMessages } from '../../components/Utils';
import { Command, CommandoClient, CommandMessage } from 'discord.js-commando';
import { RichEmbed } from 'discord.js';
import axios from "axios";

export default class AnimesSearchCommand extends Command {
    public constructor(client: CommandoClient) {
        super(client, {
            name: 'animes',
            aliases: ['anim'],
            group: 'search',
            memberName: 'animes',
            description: 'Gets information about animes.',
            examples: ['<prefix>anime naruto'],
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
                        Media (id: $id, type: ANIME, search: $search) {
                        id
                        title {
                            romaji
                            english
                            native
                        },
                        status,
                        isLicensed,
                        season,
                        episodes,
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

    
    public async run(msg: CommandMessage, {name}) {
        const serverEmbed = new RichEmbed(); 
        let info  = await this.getInfo(name)
        var logo = '✅';
        if(info.Media.isLicensed == false){
            logo = '❌';
        }
        if(info.Media.endDate.year == null){
            info.Media.endDate.year = '❓'
        }
        if(info.Media.episodes == null){
            info.Media.episodes = '❓'
        }
    
        serverEmbed
        .setColor(INFO_EMBED_COLOR)
        .setAuthor("Manga Information")
        .addField('Romaji', info.Media.title.romaji, true)
        .addField('English', info.Media.title.english, true)
        .addField('Native', info.Media.title.native, true)
        .addField('Status', info.Media.status, true)
        .addField('Season', info.Media.season, true)
        .addField('Episodes', info.Media.episodes, true)
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