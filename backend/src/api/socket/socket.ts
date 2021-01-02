import io from 'socket.io'

export const socketServer = new io.Server();

export const listenExpress = (app) =>{
    socketServer.listen(app)
    socketServer.on('connection', function (socket) {
        //socket.emit('event', {toto: 1234})
    });
}
