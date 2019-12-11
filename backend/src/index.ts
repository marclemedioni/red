import { client } from './bot';
import { webSocket } from './api/server';
// Start discord bot
client.login(process.env.DISCORD_TOKEN)
client.on('ready', ()=> {
   //Start server web
var ws = new webSocket('7000', client) 
})
