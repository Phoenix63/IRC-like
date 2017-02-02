"use strict"

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
        this.messageManager = null;
        this.imageManager = null;

        this.isImageLoading = false;

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
        this.logger._SEND_TO_CLIENT(data);

        if(this.type === 'tcp')
            this.socket.write(data+'\n\r');
        else {
            this.socket.emit('message', data);
        }

    }

    Socket.prototype.broadcast = function(str, except) {
        sockets.forEach((function(s) {
            if(except !== s) {
                s.send(str);
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
        this.socket.destroy();
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
