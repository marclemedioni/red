import "reflect-metadata";
import { client } from './bot';
import { Server } from './api/server';

// Start discord bot
client.login(process.env.DISCORD_TOKEN)

client.on('providerReady', () => {
    new Server(process.env.RED_API_PORT, client)
});
