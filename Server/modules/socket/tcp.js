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

                    /*try {
                        var json = JSON.parse(line);
                        socket.manager.emit('image', json);
                    }
                    catch (e) {socket.emit('message', line); }*/
                    socket.emit('message', line);

                }
                socket.manager.emit('data', data);

        });

        socket.on('error', function() {
            socket.emit('close');
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

    server.listen(config.tcp_server.port, config.ip);
}


module.exports = {
    create: createServer
}


