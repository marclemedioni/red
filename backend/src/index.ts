import "reflect-metadata";
import { client } from './bot';
import { Server } from './api/server';

import { init as CAH } from './cah';

// Start discord bot
client.login(process.env.DISCORD_TOKEN)

client.on('providerReady', () => {
    CAH(client);
    new Server(process.env.RED_API_PORT, client)
});
