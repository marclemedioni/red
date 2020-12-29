import socketIo from 'socket.io-client';

export const socket = socketIo.io({
    path: '/api/socket.io',
    transports: ['websocket']
}) 