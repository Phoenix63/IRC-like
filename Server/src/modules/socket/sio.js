"use strict";
import config from './../../config.json';
import sio from 'socket.io';


function createServer(callback) {
    let io = sio.listen(config.sio_server.port);
    io.on('connection', (socket) => {
        socket.remoteAddress = socket.request.connection.remoteAddress;
        callback(socket);
        socket.manager.emit('connect', socket);

        socket.destroy = () => {
            socket.disconnect();
        };

        socket.on('message', (msg) => {
            if(socket.manager._mode === 'file') {
                socket.manager.emit('data', msg);
            } else {
                if (!(msg.length > 510)) {
                    socket.manager.emit('message', msg);
                }
            }

        });

        socket.on('error', () => {
            socket.manager.close();
        });

        socket.on('disconnect', () => {
            socket.manager.close();
        });
    });
}

module.exports = {
    create: createServer
};