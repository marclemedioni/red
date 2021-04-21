import { CommandoClient } from "discord.js-commando";
import Agenda from 'agenda';
import mongoose from 'mongoose';

import GameModel from './models/game';
import GameInstance from './structures/game';
import { TextChannel } from "discord.js";

const IDLE_TICK_DELAY = '5 seconds';

const GAMES_MAP = {}

export class Idler {
    private agenda: Agenda;
    private client: CommandoClient;

    constructor(client: CommandoClient) {
        this.client = client;

        client.on('providerReady', () => {
            this.start();
        });


        process.on("SIGTERM", this.graceful.bind(this));
        process.on("SIGINT", this.graceful.bind(this));
    }

    async start() {
        await this.connectToTheDatabase();
        await this.initializeAgenda();
    }

    async runGameTick() {
        this.client.guilds.cache.forEach(async (guild) => {
            //const idlerChan = guild.channels.cache.find(channel => channel.name === this.client.provider.get(guild, 'idlerchannel', null)) as TextChannel;
            let idlerChan = await this.client.provider.get(guild, 'idlerchannel', null);
            if(idlerChan === null){
                idlerChan = guild.channels.cache.find(channel => channel.name === "idle") as TextChannel;
                if(idlerChan as TextChannel){
                    this.client.provider.set(guild.id, "idlerchannel", idlerChan.id)
                }
            }else{
                idlerChan = guild.channels.cache.find(channel => channel.id === this.client.provider.get(guild, 'idlerchannel', null)) as TextChannel;
            }
            if(idlerChan as TextChannel){
                let game = await GameModel.findOne({ guildId: guild.id }).lean();
                if (!game) {
                    const newGame = new GameModel({
                        guildId: guild.id
                    });
                    game = await newGame.save();
                }

                if (!GAMES_MAP[game._id]) {
                    GAMES_MAP[game._id] = new GameInstance(game._id, idlerChan);
                }

                GAMES_MAP[game._id].runTick();
            }
        });
    }

    private async initializeAgenda() {
        this.agenda = new Agenda({
          db: {
            address: process.env.MONGO_URI as string,
            options: { 
                useNewUrlParser: true,
                useUnifiedTopology: true,
             }
          },
        });

        this.agenda.define('gameTick', this.runGameTick.bind(this));

        this.agenda.on('ready', async () => {
            await this.agenda.every(IDLE_TICK_DELAY, 'gameTick');
            await this.agenda.start();
        })
      }

    private connectToTheDatabase() {
        return mongoose.connect(process.env.MONGO_URI as string, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
      }

    private async graceful() {
        console.log('Stopping agenda...')
        await this.agenda.stop();
        process.exit(0);
      }
}