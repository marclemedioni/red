import { CommandoClient } from "discord.js-commando";
import Agenda from 'agenda';
import mongoose from 'mongoose';

import GameModel from './models/game';
import GameInstance from './structures/game';

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
    this.client.guilds.cache.forEach(async (guild) => {
      await this.manageGuildChannels(guild);
    });
    await this.connectToTheDatabase();
    await this.initializeAgenda();
  }

  async runGameTick() {
    this.client.guilds.cache.forEach(async (guild) => {
      let game = await GameModel.findOne({ guildId: guild.id }).lean();
      if (!game) {
        game = await GameModel.create({
          guildId: guild.id
        });
      }

      if (!GAMES_MAP[game._id]) {
        GAMES_MAP[game._id] = new GameInstance(game.guildId);
      }

      GAMES_MAP[game._id].runTick();
    });
  }

  async manageGuildChannels(guild) {
    const botGuildMember = await guild.members.cache.find(member => member.id === this.client?.user?.id);
    if (!botGuildMember?.permissions.has('MANAGE_CHANNELS')) {
      return;
    }
    const hasCategoryChannel = await guild.channels.cache.find(channel => channel.type === 'category' && channel.name === 'Idler');
    const hasCommandsChannel = await guild.channels.cache.find(channel => channel.name === 'commands' && channel.type === 'text' && channel.parent?.name === 'Idler');
    const hasLogsChannel = await guild.channels.cache.find(channel => channel.name === 'logs' && channel.type === 'text' && channel.parent?.name === 'Idler');

    if (!hasCategoryChannel) {
      console.log(`Creating Idler Category Channel for Guild: ${guild.name}`);
      try {
        await guild.channels.create('Idler', { type: 'category' });
      } catch (err) {
        console.log(err);
      }
    }
    if (!hasCommandsChannel) {
      console.log(`Creating Idler Commands Channel for Guild: ${guild.name}`);
      try {
        const commandsChannel = await guild.channels.create('commands');
        await commandsChannel.setParent(guild.channels.cache.find(channel => channel.type === 'category' && channel.name === 'Idler'));
      } catch (err) {
        console.log(err);
      }
    }
    if (!hasLogsChannel) {
      console.log(`Creating Idler Logs Channel for Guild: ${guild.name}`);
      try {
        const logsChannel = await guild.channels.create('logs');
        await logsChannel.setParent(guild.channels.cache.find(channel => channel.type === 'category' && channel.name === 'Idler'));
      } catch (err) {
        console.log(err);
      }
    }

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