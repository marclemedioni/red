import "reflect-metadata";
import { client } from './bot';
import { Server } from './api/server';
import Zombies from './zombies'
// Start discord bot
client.login(process.env.DISCORD_TOKEN)

client.on('providerReady', () => {
    new Zombies(client);
    new Server('7000', client)
});
