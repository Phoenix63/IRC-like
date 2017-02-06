"use strict"

var net         = require('net');
var config      = require('./../../config.json');


function createServer(callback) {
    var server = net.createServer(function(socket) {
        callback(socket);
        socket.manager.isImageLoading = false;
        socket.buffer = '';
        socket.manager.emit('connect');
        socket.setTimeout(0);

        socket.on('timeout', function() {
            socket.manager.emit('close');
        });

        socket.on('data', function (data) {


            socket.manager.emit('data', data);

            var lines = data.toString().split(/\n|\r/),
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
            if(msg.indexOf('/image ')=== 0 || socket.manager.isImageLoading) {
                socket.manager.isImageLoading = true;
                socket.manager.emit('image', msg.toString());

            }else{
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


