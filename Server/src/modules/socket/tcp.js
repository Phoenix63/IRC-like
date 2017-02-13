"use strict"

import net from 'net';
import config from './../../config.json';
import shortid from 'shortid';

const interval = 60000;

function createServer(callback) {
    let server = net.createServer((socket) => {
        callback(socket);
        socket.buffer = '';
        socket.manager.emit('connect');
        socket.setTimeout(interval);

        socket.on('timeout', () => {
            socket.destroy();
        });

        socket.life = 1;
        socket.resetTimeout = function() {
            clearTimeout(socket.interval);
            if(socket.life <= 0) {
                socket.destroy();
            }
            socket.life--;
            socket.interval = setTimeout(() => {
                socket.manager.send('PING :'+shortid.generate());
            }, interval/2);
        };

        socket.resetTimeout();

        socket.on('data', (data) => {
            socket.life = 1;
            socket.resetTimeout();

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


