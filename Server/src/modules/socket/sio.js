"use strict";
import config from './../../config.json';
import sio from 'socket.io';
let io = sio(config.sio_server.port);

function createServer(callback) {
    io.on('connection', (socket) => {
        callback(socket);
        socket.manager.emit('connect', socket);

        socket.destroy = () => {
            socket.disconnect();
        };

        socket.on('message', (msg) => {
            if (!(msg.length > 510)) {
                socket.manager.emit('message', msg);
            }
        });

        socket.on('error', () => {
            socket.manager.emit('close');
        });

        socket.on('disconnect', () => {
            socket.manager.emit('close');
        });
    });
}

module.exports = {
    create: createServer
};