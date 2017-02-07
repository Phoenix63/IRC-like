"use strict"

import shortid from 'shortid';
import err from './../SignalManager';

let clients = [];

class Client {

    constructor(socket) {
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

    setIdentity(pseudo) {
        if(this.identity)
            return false;
        clients.forEach((c) => {
            if(c.identity === pseudo)
                return false;
        });
        this.identity = pseudo;
        return true;
    }

    delete() {
        this.channels.forEach((function(c) {
            c.removeUser(this);
        }).bind(this));
        this.socket.close();
        clients.splice(clients.indexOf(this), 1);
        delete this;
    };

    get name() {
        return this.nick || 'Guest_'+this.id;
    }

    // get real name
    get rname() {
        return this.realname || 'Guest_'+this.id;
    }

    set name(name) {
        if(name[0] === ':') {
            name = name.slice(1,name.length);
        }

        clients.forEach(((c) => {
            if(c.name === name
                    .replace(/\[/, '{')
                    .replace(/\]/, '}')
                    .replace(/\|/, '\\')
                    .replace(/\{/, '[')
                    .replace(/\}/, ']')
                    .replace(/\\/, '\|')) {
                err.ERR_NICKNAMEINUSE(this.socket);
                return null;
            }
        }).bind(this));

        let match = name.match(/[a-zA-Z0-9\[\]\{\}_-é"'ëäïöüâêîôûç`è]+/);
        if((match && match[0] !== name) || name === '') {
            err.ERR_NONICKNAMEGIVEN(this.socket);
            return;
        }
        this.socket.logger._USER_CHANGE_NICK(name);
        this.socket.broadcast(':'+this.name+' NICK '+name);
        this.nick = name;
    }

    static find(id) {
        for(let key in clients) {
            if( key === id || clients[key].name === id || client[key].id === id) {
                return clients[key];
            }
        }
        throw "Client "+id+" is not in the list";
    }
    static list() {
        return clients;
    }

}

module.exports = Client;