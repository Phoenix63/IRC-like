var net         = require('net');
var config      = require('./../../config.json');


function createServer(callback) {
    var server = net.createServer(function(socket) {
        callback(socket);
        socket.buffer = '';

        socket.manager.emit('connect');

        socket.on('data', function (data) {
            var lines = data.toString().split(/\n|\r/),
                i, line;

            for (i = 0; i < lines.length - 1; i += 1) {
                line = socket.buffer + lines[i];
                socket.buffer = '';

                if (line.length <= 510) {
                    socket.emit('message', line);
                } else {
                    console.warn(socket.remoteAddress, socket.name,
                        'Bufferoverflow');
                    socket.buffer = '';
                }
            }

            socket.buffer += lines[lines.length - 1];
            if (socket.buffer.length >= 510) {
                console.warn(socket.remoteAddress, socket.name, 'Bufferoverflow.');
                socket.buffer = '';
            }
            socket.manager.emit('data', data);
        });

        socket.on('message', function (msg) {
            if (msg.trim() === '') {
                return;
            }
            socket.manager.emit('message', msg);
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

    server.listen(config.tcp_server.port, config.tcp_server.ip);
}


module.exports = {
    create: createServer
}


