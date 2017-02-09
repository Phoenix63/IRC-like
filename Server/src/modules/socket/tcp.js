"use strict"

import net from 'net';
import config from './../../config.json';

const interval = 0;

function createServer(callback) {
    let server = net.createServer((socket) => {
        callback(socket);
        socket.buffer = '';
        socket.manager.emit('connect');
        socket.setTimeout(interval);

        socket.on('timeout', () => {
            socket.destroy();
        });

        socket.timeoutKill = null;

        socket.timeoutReset = () => {
            if(interval>0) {
                clearTimeout(socket.timeoutKill);
                socket.timeoutKill = setTimeout(() => {
                    socket.write('PING :'+config.ip+'\n');
                },interval/2);
            }
        };

        socket.timeoutReset();

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
            socket.destroy();
        });

        socket.on('message', (msg) => {
            if (msg.trim() === '') {
                return;
            }
            if (!(msg.length > 510)) {
                socket.timeoutReset();
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


