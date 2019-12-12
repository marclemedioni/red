import "reflect-metadata";
import { client } from './bot';
import  {Server}  from './api/server';
import Zombies from './zombies'
// Start discord bot
client.login(process.env.DISCORD_TOKEN)

client.on('ready', () => {
    //Start server web
   new Server('7000', client)
})

client.on('providerReady', () => {
    new Zombies(client);
});
