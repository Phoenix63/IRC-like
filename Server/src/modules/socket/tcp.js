"use strict"

import net from 'net';
import config from './../../config.json';


function createServer(callback) {
    let server = net.createServer((socket) => {
        callback(socket);
        socket.buffer = '';
        socket.manager.emit('connect');
        socket.setTimeout(0);
        socket.isClosed = false;

        socket.on('timeout', () => {
            socket.manager.emit('close');
        });

        socket.on('data', (data) => {


            socket.manager.emit('data', data);

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
            socket.emit('close');
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
            if(!socket.isClosed) {
                socket.manager.emit('close');
            }
            socket.isClosed = true;
        });
        socket.on('end', () => {
            socket.emit('close');
        });


    });

    server.on('listening', () => {
        console.log('Server listening');
    });

    server.on('close', () => {
        console.log('Server is now closed');
    });

    server.on('error', (err) => {
        console.log('error:', err);
    });

    server.listen(config.tcp_server.port, config.ip);
}


module.exports = {
    create: createServer
}


