"use strict";
import config from './../../config.json';
import sio from 'socket.io';
import Socket from './socket';
import ERRSender from './../responses/ERRSender';

function createServer(callback) {
    let io = sio.listen(config.sio_server.port);
    io.on('connection', (socket) => {
        socket._connectionType = 'sio';
        if(Socket.isBan(socket.handshake.address)){
            ERRSender.ERR_YOUAREBANNED(socket);
            socket.disconnect(true);
            return;
        }
        if(!Socket.ipConnected[socket.handshake.address]) {
            Socket.ipConnected[socket.handshake.address] = 0;
        }
        Socket.ipConnected[socket.handshake.address]++;

        if(Socket.list().length > config.maxConnections) {
            ERRSender.ERR_SERVERSIZELIMIT(socket);
            socket.disconnect(true);
            return;
        }
        if(Socket.ipConnected[socket.handshake.address] > config.maxClientByIP) {
            Socket.ipConnected[socket.handshake.address]--;
            ERRSender.ERR_MAXCONNECTIONPERIP(socket);
            socket.disconnect(true);
            return;
        }
        socket.remoteAddress = socket.request.connection.remoteAddress;
        socket.destroy = () => {
            socket.disconnect();
        };
        callback(socket);
        socket.manager.emit('connect', socket);

        socket.on('message', (msg) => {
            if (socket.manager._mode === 'file') {
                socket.manager.emit('data', msg);
            } else {
                if (!(msg.length > 510)) {
                    socket.manager.emit('message', msg);
                }
            }

        });
        socket.on('error', () => {
            socket.manager.onClose();
        });
        socket.on('disconnect', () => {
            socket.manager.onClose();
        });
    });
}

module.exports = {
    create: createServer
};