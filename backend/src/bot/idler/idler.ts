import { CommandoClient } from "discord.js-commando";
import { TextChannel } from "discord.js";
import Agenda from 'agenda';
import { roundNumber } from "../components/Utils";

const IDLE_TICK_DELAY = '5 seconds';

const mongoConnectionString = 'mongodb://127.0.0.1/red';
const agenda = new Agenda({ db: { address: mongoConnectionString } });

export class Idler {
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
        agenda.define('gameTick', async (job) => {
            this.client.guilds.cache.forEach(guild => {
                const idlerChan = guild.channels.cache.find(channel => channel.name === this.client.provider.get(guild, 'idlerchannel', null)) as TextChannel;
                console.log(idlerChan)
                if (!!idlerChan) {
                    idlerChan.send('Tick')
                }
            });
        });
        
        await agenda.every(IDLE_TICK_DELAY, 'gameTick');
        await agenda.start();
    }

    private async graceful() {
        console.log('Stopping agenda...')
        await agenda.stop();
        process.exit(0);
      }
}