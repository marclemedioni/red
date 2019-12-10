import { CommandoClient } from "discord.js-commando";
import { TextChannel } from "discord.js";
import Agenda from 'agenda';

const IDLE_TICK_DELAY = '10 seconds';

const mongoConnectionString = 'mongodb://127.0.0.1/red';
const agenda = new Agenda({ db: { address: mongoConnectionString } });

export class Idler {
    private client: CommandoClient;

    constructor(client: CommandoClient) {
        this.client = client;

        client.on('ready', () => {
            client.guilds.forEach(guild => {
                console.log(guild.id)
            });

            this.start();
        });

        agenda.define('gameTick', async job => {
            // this.client.guilds.forEach(guild => {
            //     const idlerChan = guild.channels.get(this.client.provider.get(guild, 'idlerchannel', null)) as TextChannel;
            //     if (!!idlerChan) {
            //         idlerChan.send(' Tick')
            //     }
            // });
        });
    }

    async start() {
        await agenda.start();

        await agenda.every(IDLE_TICK_DELAY, 'gameTick');
    }
}