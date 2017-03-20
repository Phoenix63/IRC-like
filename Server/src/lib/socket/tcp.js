"use strict"

import net from 'net';
import config from './../../config.json';
let debug = require('debug')('pandirc:tcp');
import Socket from './socket';
import ERRSender from './../responses/ERRSender';

function createServer(callback) {
    let server = net.createServer((socket) => {
        socket._connectionType = 'tcp';
        if(Socket.isBan(socket.remoteAddress)){
            ERRSender.ERR_YOUAREBANNED(socket);
            socket.destroy();
            return;
        }
        if(!Socket.ipConnected[socket.remoteAddress]) {
            Socket.ipConnected[socket.remoteAddress] = 0;
        }
        Socket.ipConnected[socket.remoteAddress]++;

        if(Socket.list().length > config.maxConnections) {
            ERRSender.ERR_SERVERSIZELIMIT(socket);
            socket.destroy();
            return;
        }
        if(Socket.ipConnected[socket.remoteAddress] > config.maxClientByIP) {
            ERRSender.ERR_MAXCONNECTIONPERIP(socket);
            socket.destroy();
            return;
        }
        callback(socket);
        socket.buffer = '';
        socket.manager.emit('connect');
        socket.setTimeout(config.timeout*1000);

        socket.on('timeout', () => {
            socket.destroy();
        });

        socket.on('data', (data) => {
            let lines = data.toString().split(/\n|\r/),
                i, line;

            for (i = 0; i < lines.length - 1; i += 1) {
                line = socket.buffer + lines[i];
                socket.buffer = '';

                socket.emit('message', line);
                socket.receiving = false;
            }

            socket.buffer += lines[lines.length - 1];
        });

        socket.on('error', () => {
            socket.destroy();
        });

        socket.on('message', (msg) => {
            if (msg.trim() === '') {
                return;
            }
            if (!(msg.length > 510)) {
                socket.manager.emit('message', msg);
            }
        });

        socket.on('close', () => {
            socket.manager.onClose();
        });
        socket.on('end', () => {
            socket.manager.onClose();
        });


    });

    server.on('error', (err) => {
        debug('error:', err);
    });

    server.listen(config.tcp_server.port, config.ip);
}


module.exports = {
    create: createServer
}


