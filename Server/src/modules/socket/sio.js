"use strict"

import config from './../../config.json';
import sio from 'socket.io';

let io = sio(config.sio_server.port);

var watchers = {};


function createServer(callback) {
    io.on('connection', function(socket) {
        callback(socket);
        socket.manager.emit('connect', socket);

        socket.destroy = function() {
            socket.disconnect();
        };

        socket.on('message', function(msg) {
            if(!(msg.length > 510)) {
                socket.manager.emit('message', msg);
            }
        });

        socket.on('error', function() {
            socket.manager.emit('end');
            socket.manager.emit('close');
        });

        socket.on('disconnect', function() {
            socket.manager.emit('end');
            socket.manager.emit('close');
        });
    });
}

module.exports = {
    create: createServer
}