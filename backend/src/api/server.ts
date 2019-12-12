const express = require('express')
const bodyParser = require("body-parser");
import {routes} from './router/routes'
import { listenExpress} from './socket/socket'

export class Server{
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
        

        routes(this.client, this.router)
        this.app.use(this.router)
        this.server = this.app.listen(port, () => {
            console.log("Websocket API set up at port " + this.server.address().port)
        })
        listenExpress(this.server)
       

    }
}
