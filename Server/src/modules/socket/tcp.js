"use strict"

import net from 'net';
import config from './../../config.json';


function createServer(callback) {
    let server = net.createServer(function(socket) {
        callback(socket);
        socket.buffer = '';
        socket.manager.emit('connect');
        socket.setTimeout(0);

        socket.on('timeout', function() {
            socket.manager.emit('close');
        });

        socket.on('data', function (data) {


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

        socket.on('error', function() {
            socket.emit('close');
        });

        socket.on('message', function (msg) {
            if (msg.trim() === '') {
                return;
            }
            if(!(msg.length > 510)) {
                socket.manager.emit('message', msg);
            }
        });

        socket.on('close', function() {
            socket.manager.emit('close');
        });
        socket.on('end', function () {
            socket.manager.emit('end');
        });


    });

    server.on('listening', function () {
        console.log('Server listening');
    });

    server.on('close', function () {
        console.log('Server is now closed');
    });

    server.on('error', function (err) {
        console.log('error:', err);
    });

    server.listen(config.tcp_server.port, config.ip);
}


module.exports = {
    create: createServer
}


