var config      = require('./../../config.json');
var io          = require('socket.io')(config.sio_server.port);

var watchers = {};


function createServer(callback) {
    io.on('connection', function(socket) {
        callback(socket);
        socket.manager.emit('connect', socket);

        socket.on('message', function(data) {
            socket.manager.emit('message', data);
        });

        socket.on('disconnect', function() {
            socket.manager.emit('end');
        });
    });
}

module.exports = {
    create: createServer
}