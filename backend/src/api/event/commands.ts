import {socketServer} from '../socket/socket'
import {client} from '../../bot'

export const eventCommands =  () => {

 client.on('commandRun', (command, message, args)=>{
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
 client.on('commandPrefixChange', (guild, prefix) => {
     console.log('je change de prefix')
        socketServer.emit('event', {user:{
            username:'Anonymous',
            avatar: 'https://cdn.imgbin.com/7/11/4/imgbin-sticker-guy-fawkes-mask-anonymous-decal-anonymous-mask-guyfoks-mask-iqHURqGcGpvFZ6XBra9xEb5ja.jpg',
        },
        message:{
            content: "Prefix edit in "+prefix,
            timeStamp: Date(),
            guild:guild.name
        },
        command:"Prefix",
        etat:'Success' })
  })


}