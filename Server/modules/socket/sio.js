"use strict"

var config      = require('./../../config.json');
var io          = require('socket.io')(config.sio_server.port);

var watchers = {};


function createServer(callback) {
    io.on('connection', function(socket) {
        callback(socket);
        socket.manager.emit('connect', socket);

        socket.on('message', function(msg) {
            if(msg.indexOf('/image ')=== 0 || socket.manager.isImageLoading) {
                socket.manager.isImageLoading = true;
                socket.manager.emit('image', msg.toString());
                socket.manager.isImageLoading = false;
            }
            if(!socket.manager.isImageLoading) {
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