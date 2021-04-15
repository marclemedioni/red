import {socketServer} from '../socket/socket'
import {client} from '../../bot'

export const eventCommands =  () => {

 client.on('commandRun', (command, _message, args, fromPattern, promise)=>{
    socketServer.emit('event', {user:{
                                        username: args.member?.displayName,
                                        avatar: args.author.avatarURL,
                                    },
                                message:{
                                    content: args.content,
                                    timeStamp: args.createdTimestamp,
                                    guild:args.guild.name,
                                    pattern:fromPattern,
                                    test:promise
                                },
                                command:command.name,
                                etat:'Success' })
 })
 client.on('commandError', (command, _error, message, args, _from) => {
    socketServer.emit('event', {user:{
                                        username: message.member?.displayName,
                                        avatar: message.author.avatarURL,
                                    },
                                message:{
                                    content: message.content,
                                    timeStamp: message.createdTimestamp,
                                    guild: message.guild.name
                                },
                                command:command.name,
                                etat:'Error' })
 })
 client.on('unknownCommand', (message ) => {
        socketServer.emit('event', {message})
  })


}