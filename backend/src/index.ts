import { client } from './bot';
import Zombies from './zombies'

// Start discord bot
client.login(process.env.DISCORD_TOKEN);

client.on('providerReady', () => {
    new Zombies(client);
});