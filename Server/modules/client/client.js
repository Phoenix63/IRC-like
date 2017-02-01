"use strict"

var shortid     = require('shortid');
var err         = require('../ErrorManager');

var clients = [];

const Client = (function () {

    function Client(socket) {
        this.id = shortid.generate();
        this.nick = null;
        this.socket = socket;
        this.socket.client = this;
        clients.push(this);
    }

    Client.prototype.delete = function () {
        this.socket.close();
        clients.splice(clients.indexOf(this), 1);
        delete this;
    };

    Client.prototype.__defineGetter__('name', function() {
        return this.nick || 'Guest_'+this.id;
    });

    Client.prototype.__defineSetter__('name', function(name) {
        if(clients.indexOf(name
                .replace(/\[/, '{')
                .replace(/\]/, '}')
                .replace(/\|/, '\\')
                .replace(/\{/, '[')
                .replace(/\}/, ']')
                .replace(/\\/, '\|'))>=0) {
            err.ERR_NICKCOLLISION(this.socket);
            return;
        }
        if(name === '') {
            err.ERR_NONICKNAMEGIVEN(this.socket);
            return;
        }
        this.socket.logger._USER_CHANGE_NICK(name);
        this.socket.broadcast(':'+this.name+' NICK '+name);
        this.nick = name;
    });

    Client.find = function(id) {
        for(var key in clients) {
            if( key === id || clients[key].name === id || client[key].id === id) {
                return clients[key];
            }
        }
        throw "Client "+id+" is not in the list";
        return null;
    };
    Client.list = function() {
        return clients;
    };

    return Client;
})();

module.exports = Client;