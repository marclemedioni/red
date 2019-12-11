const express = require('express')
const bodyParser = require("body-parser");

export class webSocket{
    port:Number;
    client:object;
    app:any;
    router:any;
    server:any;
    constructor(port, client){
        this.port = port
        this.client = client
        this.app = express()
        this.router = express.Router();

        this.app.use((req, res, next)=>{
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
            this.app.options('*', (req, res) => {
                // allowed XHR methods  
                res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
                res.send();
            });
        })
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());

        this.registerRoots(this.client)
        this.app.use(this.router)
        this.server = this.app.listen(port, () => {
            console.log("Websocket API set up at port " + this.server.address().port)
        })

    }
    registerRoots(client) {
        this.router.route('/client')
            .get(function(req,res){
                res.json({guilds:client.guilds.size.toString(), channels:client.channels.size.toString(), users: client.users.size.toString(), uptime:client.uptime})
            })
        this.router.route('/guilds')
            .get(function(req,res){
                res.json({guilds:client.guilds.array(), channels:client.channels.filter(c => c.type == 'text').array()})
            })
        this.router.route('/message')
            .post(function(req,res){
                var channel = req.body.selectChannel
                var guild = req.body.selectGuild
                var text = req.body.text
                guild = client.guilds.find('id', guild);
                channel = guild.channels.get(channel)
                if(channel){
                    channel.send(text)
                    res.sendStatus(200)
                }else{
                    res.sendStatus(406)
                }
            })
    }
}
