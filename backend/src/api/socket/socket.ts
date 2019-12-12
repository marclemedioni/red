import io from 'socket.io'

export const socketServer = io();

export const listenExpress = (app) =>{
    
    socketServer.listen(app)
    socketServer.sockets.on('connection', function (socket) {
        console.log('Un client est connecté !');
    });
}
