import { CommandoClient } from "discord.js-commando";
import { Guild, TextChannel } from "discord.js";
import { plainToClass } from "class-transformer";

import { infoLog } from './logger';
import { ZombiesMap } from './Map';
import { Player } from "./Player";

const DISCORD_CATEGORY_CHANNEL_NAME = 'zombies';
const DISCORD_CITY_CHANNEL_NAME = 'village';
const MAP_SIZE = 10;

export class ZombiesGame {
    guild: Guild;
    client: CommandoClient;
    players: Player[];
    map: ZombiesMap;
    day: number;

    constructor(client: CommandoClient) {
        this.client = client;

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

    load(guild: Guild) {
        this.guild = guild;

        console.log(`Loading game for ${guild.name}`);
        infoLog.info(`Loading game for ${guild.name}`);

        // Retrieve data from db
        const gameData = this.client.provider.get(guild, 'zombies', null);

        // Put data into game object
        this.players = gameData.players.map(player => plainToClass(Player, player));
        this.map = plainToClass(ZombiesMap, gameData.map);

        console.log(this.map.toString())

        // TODO
        // Start game
    }

    async init(guild, participants) {
        this.guild = guild;
        this.day = 1;
        this.players = participants.map(participant => plainToClass(Player, {
            id: participant.id,
            name: participant.username,
            hungry: false,
            thirsty: true
        }))
        this.map = new ZombiesMap(MAP_SIZE);
        this.map.generate()

        this.save();

        await this.manageGuildChannels();

        const cityChannel = await this.guild.channels.find(channel => channel.name === DISCORD_CITY_CHANNEL_NAME && channel.type === 'text' && channel.parent && channel.parent.name === DISCORD_CATEGORY_CHANNEL_NAME) as TextChannel;
        await cityChannel.send(`\`\`\`${this.map.toString()}\`\`\``);

        // TODO
        // Start game
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
                const commandsChannel = await this.guild.createChannel(DISCORD_CITY_CHANNEL_NAME, {
                    type: 'text',
                    permissionOverwrites: [{
                        id: this.guild.id,
                        deny: ['SEND_TTS_MESSAGES', 'ATTACH_FILES', 'MENTION_EVERYONE'],
                        allow: ['SEND_MESSAGES', 'ADD_REACTIONS']
                    }]
                });
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

        await CategoryChannel.delete();
        await CityChannel.delete();
    }

    async start() {
        // await agenda.start();
        // await agenda.every(IDLE_TICK_DELAY, 'gameTick');
    }


    async destroy() {
        console.log(`Destroying Zombies game for guild: ${this.guild.name}`);
        infoLog.info(`Destroying Zombies game for guild: ${this.guild.name}`);
        await this.client.provider.remove(this.guild, 'zombies');
        await this.removeGuildChannels();
    }

    save() {
        this.client.provider.set(this.guild, 'zombies', {
            day: this.day,
            players: this.players,
            map: this.map
        });
    }
}

