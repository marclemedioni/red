import {socketServer} from '../socket/socket'
import {client} from '../../bot'

export const eventCommands =  () => {

 client.on('commandRun', (command, message, args, fromPattern, promise)=>{
    socketServer.emit('event', {user:{
                                        username:args.message.member.displayName,
                                        avatar: args.message.author.avatarURL,
                                    },
                                message:{
                                    content: args.message.content,
                                    timeStamp: args.message.createdTimestamp,
                                    guild:args.message.guild.name,
                                    pattern:fromPattern,
                                    test:promise
                                },
                                command:command.name,
                                etat:'Success' })
 })
 client.on('commandError', (command, message, args)=>{
    socketServer.emit('event', {user:{
                                        username:args.message.member.displayName,
                                        avatar: args.message.author.avatarURL,
                                    },
                                message:{
                                    content: args.message.content,
                                    timeStamp: args.message.createdTimestamp,
                                    guild:args.message.guild.name
                                },
                                command:command.name,
                                etat:'Error' })
 })
 client.on('unknownCommand', (message ) => {
        socketServer.emit('event', {message})
  })


}