import { CommandoClient } from "discord.js-commando";
import { Guild } from "discord.js";
import { IGame, IPlayer, IGameData } from "./zombies";
import { infoLog } from './logger';

const DISCORD_CATEGORY_CHANNEL_NAME = 'zombies';
const DISCORD_CITY_CHANNEL_NAME = 'village';

export class ZombiesGame implements IGame {
    guild: Guild;
    client: CommandoClient;
    players: IPlayer[];

    constructor(client: CommandoClient, guild: Guild, gameData: IGameData | null) {
        this.client = client;
        this.guild = guild;

        this.manageGuildChannels();
        this.loadGame(gameData);
        this.start();

        // client.on('ready', () => {
        //     client.guilds.forEach(guild => {
        //         console.log(guild.id)
        //     });

        //     this.start();
        // });

        // agenda.define('gameTick', async job => {
        //     // this.client.guilds.forEach(guild => {
        //     //     const idlerChan = guild.channels.get(this.client.provider.get(guild, 'idlerchannel', null)) as TextChannel;
        //     //     if (!!idlerChan) {
        //     //         idlerChan.send(' Tick')
        //     //     }
        //     // });
        // });
    }

    loadGame(gameData) {
        if (gameData) {
            console.log(`Loading game for ${this.guild.name}`);
            infoLog.info(`Loading game for ${this.guild.name}`);
            this.players = gameData.players
        }
        else {
            this.client.provider.set(this.guild, 'zombies', {});
        }
    }

    async manageGuildChannels() {
        const botGuildMember = await this.guild.members.find(member => member.id === this.client.user.id);
        if (!botGuildMember.permissions.has('MANAGE_CHANNELS')) {
            return;
        }
        const hasCategoryChannel = await this.guild.channels.find(channel => channel.type === 'category' && channel.name === DISCORD_CATEGORY_CHANNEL_NAME);
        const hasCityChannel = await this.guild.channels.find(channel => channel.name === DISCORD_CITY_CHANNEL_NAME && channel.type === 'text' && channel.parent && channel.parent.name === DISCORD_CATEGORY_CHANNEL_NAME);

        if (!hasCategoryChannel) {
            console.log(`Creating Zombies Category Channel for Guild: ${this.guild.name}`);
            infoLog.info(`Creating Zombies Category Channel for Guild: ${this.guild.name}`);
            try {
                await this.guild.createChannel(DISCORD_CATEGORY_CHANNEL_NAME, {
                    type: 'category'
                });
            } catch (err) {
                console.log(err);
            }
        }

        if (!hasCityChannel) {
            console.log(`Creating Zombies Commands Channel for Guild: ${this.guild.name}`);
            infoLog.info(`Creating Zombies Commands Channel for Guild: ${this.guild.name}`);
            try {
                const commandsChannel = await this.guild.createChannel(DISCORD_CITY_CHANNEL_NAME, 'text', [{
                    id: this.guild.id,
                    deny: ['SEND_TTS_MESSAGES', 'ATTACH_FILES', 'MENTION_EVERYONE'],
                    allow: ['SEND_MESSAGES', 'ADD_REACTIONS']
                }], 'Creating channels for Zombies');
                await commandsChannel.setParent(this.guild.channels.find(channel => channel.type === 'category' && channel.name === DISCORD_CATEGORY_CHANNEL_NAME));
                await commandsChannel.setTopic('Bienvenue en ville !', 'Setting up Zombies Channels');
            } catch (err) {
                console.log(err);
            }
        }
    }

    async removeGuildChannels() {
        const CategoryChannel = await this.guild.channels.find(channel => channel.type === 'category' && channel.name === DISCORD_CATEGORY_CHANNEL_NAME);
        const CityChannel = await this.guild.channels.find(channel => channel.name === DISCORD_CITY_CHANNEL_NAME && channel.type === 'text' && channel.parent && channel.parent.name === DISCORD_CATEGORY_CHANNEL_NAME);

        CategoryChannel.delete();
        CityChannel.delete();
    }

    async start() {
        // await agenda.start();
        // await agenda.every(IDLE_TICK_DELAY, 'gameTick');
    }


    destroy() {
        console.log(`Destroying Zombies game for guild: ${this.guild.name}`);
        infoLog.info(`Destroying Zombies game for guild: ${this.guild.name}`);
        this.client.provider.remove(this.guild, 'zombies');
        this.removeGuildChannels();
    }
}

