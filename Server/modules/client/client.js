"use strict"

var shortid     = require('shortid');
var err         = require('../SignalManager');

var clients = [];

const Client = (function () {

    function Client(socket) {
        this.id = shortid.generate();
        this.nick = null;
        this.identity = null;
        this.realname = null;
        this.socket = socket;
        this.socket.client = this;
        this.away = false;
        this.ip = socket.socket.remoteAddress;

        this.channels = [];
        clients.push(this);
    }

    Client.prototype.setIdentity = function(pseudo) {
        if(this.identity)
            return false;
        this.identity = pseudo;
        return true;
    }

    Client.prototype.delete = function () {
        this.channels.forEach((function(c) {
            c.removeUser(this);
        }).bind(this));
        this.socket.close();
        clients.splice(clients.indexOf(this), 1);
        delete this;
    };

    Client.prototype.__defineGetter__('name', function() {
        return this.nick || 'Guest_'+this.id;
    });

    Client.prototype.__defineGetter__('rname', function() {
        return this.realname || 'Guest_'+this.id;
    });

    Client.prototype.__defineSetter__('name', function(name) {

        if(name[0] === ':') {
            name = name.slice(1,name.length);
        }

        clients.forEach((function(c) {
            if(c.name === name
                    .replace(/\[/, '{')
                    .replace(/\]/, '}')
                    .replace(/\|/, '\\')
                    .replace(/\{/, '[')
                    .replace(/\}/, ']')
                    .replace(/\\/, '\|')) {
                err.ERR_NICKNAMEINUSE(this.socket);
                return;
            }
        }).bind(this));

        var match = name.match(/[a-zA-Z0-9\[\]\{\}_-é"'ëäïöüâêîôûç`è]+/);
        if((match && match[0] !== name) || name === '') {
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