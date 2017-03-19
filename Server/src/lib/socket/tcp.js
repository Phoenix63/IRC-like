"use strict"

import net from 'net';
import config from './../../config.json';
let debug = require('debug')('pandirc:tcp');
import Socket from './socket';

function createServer(callback) {
    let server = net.createServer((socket) => {
        if(Socket.isBan(socket.remoteAddress)){
            socket.destroy();
            return;
        }
        callback(socket);
        socket.buffer = '';
        socket.manager.emit('connect');
        socket.setTimeout(0);

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


