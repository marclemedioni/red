import {socketServer} from '../socket/socket'
import {client} from '../../bot'
export const routes = (router) => {
    router.route('/client')
        .get(function(req,res){
            res.json({guilds:client.guilds.cache.size.toString(), channels:client.channels.cache.size.toString(), users: client.users.cache.size.toString(), uptime:client.uptime})
        })
    router.route('/guilds')
        .get(function(req,res){
            socketServer.emit('toto', {data:'coucou'})
            res.json({guilds:client.guilds.cache.array(), channels:client.channels.cache.filter(c => c.type == 'text').array()})
        })
    router.route('/message')
        .post(function(req,res){
            var channel = req.body.selectChannel
            var guild = req.body.selectGuild
            var text = req.body.text
            guild = client.guilds.resolve(guild);
            channel = guild.channels.get(channel)
            if(channel){
                channel.send(text)
                res.sendStatus(200)
            }else{
                res.sendStatus(406)
            }
        })
    router.route('/commands')
        .get(function(req,res){
            res.json({groups:client.registry.groups.array(), commands:client.registry.commands.array(), prefix:client.commandPrefix})
        })
}

                         