var tcp     = require('./tcp');
var sio     = require('./sio.js');
var shortid = require('shortid');

var sockets = [];

var Socket = (function() {

    function Socket(type, soc) {
        this.id = '__'+shortid.generate();
        this.type = type;
        this.socket = soc;
        this.client = null;
        this.logger = null;
        sockets.push(this);

        this.onSignal = {};
    }

    Socket.__defineSetter__('client', function cli() {
        this.client = cli;
    });
    Socket.__defineSetter__('logger', function(log) {
        this.logger = log;
    });

    Socket.prototype.send = function(data) {
        if(this.type === 'tcp')
            this.socket.write(data+'\n');
        else {
            this.socket.emit('message', data);
        }

    }

    Socket.prototype.broadcast = function(str) {
        sockets.forEach((function(soc) {
            if(soc.id !== this.id) {
                soc.send(str+'\n');
            }
        }).bind(this));
    }

    Socket.prototype.on = function(event, callback) {
        this.onSignal[event] = callback;
    }

    Socket.prototype.emit = function(event, data) {
        if(this.onSignal[event])
            this.onSignal[event](data);
    }

    Socket.prototype.close = function() {
        sockets.splice(sockets.indexOf(this), 1);
        delete this;
    }

    return Socket;
})();

function create(callback) {
    tcp.create(function(socket) {
        var soc = new Socket('tcp', socket);
        socket.manager = soc;
        callback(soc);
    });
    sio.create(function(socket) {
        var soc = new Socket('sio', socket);
        socket.manager = soc;
        callback(soc);
    })
}


module.exports = {
    create: create
}
