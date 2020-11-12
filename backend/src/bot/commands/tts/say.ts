/**
 * @file tts Say - Say something
 *
 * **Aliases**: `say`
 * @module
 * @category tts
 * @name say
 */

import { deleteCommandMessages } from '../../components/Utils';
import { Command, CommandoClient, CommandMessage } from 'discord.js-commando';
import googleTTS from 'google-tts-api';

export default class AnimesSearchCommand extends Command {
    public constructor(client: CommandoClient) {
        super(client, {
            name: 'say',
            aliases: ['s'],
            group: 'tts',
            memberName: 'say',
            description: 'Say something.',
            examples: ['<prefix>say OMEGALUL'],
            guildOnly: false,
            args: [{key: 'textToSay', type: 'string', prompt:'string'}],
            throttling: {
                usages: 2,
                duration: 3,
            },
        });
    }

    
    public async run(msg: CommandMessage, {textToSay}) {
        if (!msg.member!.voiceChannel) return msg.reply('Please join a voice channel before issuing this command.');
        if (textToSay.length > 200) return msg.reply(`To long, didn't read`);

        const voiceChannel = await msg.member.voiceChannel.join();

        const tts = await googleTTS(textToSay, 'fr', 1)
        deleteCommandMessages(msg, this.client);
        const dispatcher = await voiceChannel.playStream(tts);

        dispatcher.on('end', end => { //working fine
            setTimeout(() => {
                msg.member.voiceChannel.leave();
            }, 3000)
        });
            
        

        return msg.reply(`Let's say so...`);
    }
}