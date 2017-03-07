"use strict"

import net from 'net';
import config from './../../config.json';
import colors from 'colors';

function createServer(callback) {
    let server = net.createServer((socket) => {
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
            socket.manager.close();
        });
        socket.on('end', () => {
            socket.manager.close();
        });


    });

    server.on('error', (err) => {
        console.log('error:', err);
    });

    server.listen(config.tcp_server.port, config.ip);
}


module.exports = {
    create: createServer
}


