"use strict"

import shortid from 'shortid';
import Socket from './../socket/socket';

import ERRSender from './../responses/ERRSender';
import RPLSender from './../responses/RPLSender';


let clients = [];

class Client {

    /**
     * constructor
     * @param {Socket} socket
     */
    constructor(socket) {
        this._id = shortid.generate();
        this._name = null;
        this._identity = null;
        this._realname = null;
        this._socket = socket;
        this._socket.client = this;
        this._away = false;
        this._ip = socket.socket.remoteAddress;

        this._channels = [];
        clients.push(this);
    }


    /**
     * get user socket or null if its not defined
     * @returns {null|Socket}
     */
    get socket() {
        return this._socket;
    }

    /**
     * get user id
     * @returns {string}
     */
    get id() {
        return this._id;
    }

    /**
     * get user ip, may be 127.0.0.1 if not defined
     * @returns {string}
     */
    get ip() {
        return this._ip || '127.0.0.1';
    }

    /**
     * get user identity, may be Guest_<id> if not defined
     * @returns {string}
     */
    get identity() {
        return this._identity || 'Guest_'+this._id;
    }

    /**
     * get user name, may be Guest_<id> if not defined
     * @returns {string}
     */
    get name() {
        return this._name || 'Guest_'+this._id;
    }

    /**
     * get user realname, may be Guest_<id> if not defined
     * @returns {string}
     */
    get realname() {
        return this._realname || 'Guest_'+this._id;
    }

    /**
     *
     * @param {string} val
     */
    set realname(val) {
        this._realname = val;
    }

    /**
     * return true if user is registered / else false
     * @returns {boolean}
     */
    get isRegistered() {
        return (this._realname !== null) && (this._name !== null);
    }

    /**
     *
     * @returns {Array}
     */
    get channels() {
        return this._channels;
    }

    /**
     * change identity of user if its valid
     * @param {string} identity
     */
    set identity(identity) {
        if(!this._identity)
            this._identity = identity;
    }

    /**
     * set the user name
     * @param {string} name
     */
    set name(name) {
        if(name[0] === ':') {
            name = name.slice(1,name.length);
        }

        clients.forEach((c) => {
            if(c.name === name
                    .replace(/\[/, '{')
                    .replace(/\]/, '}')
                    .replace(/\|/, '\\')
                    .replace(/\{/, '[')
                    .replace(/\}/, ']')
                    .replace(/\\/, '\|')) {
                ERRSender.ERR_NICKNAMEINUSE(this);
                return null;
            }
        });

        let match = name.match(/[a-zA-Z0-9\[\]\{\}_-é"'ëäïöüâêîôûç`è]+/);
        if((match && match[0] !== name) || name === '') {
            ERRSender.ERR_NONICKNAMEGIVEN(this);
            return;
        }
        this.socket.logger._USER_CHANGE_NICK(name);
        this.socket.broadcast(':'+this.name+' NICK '+name);
        this._name = name;
    }

    /*
    * methods
     */

    /**
     * delete the current user
     */
    delete() {
        this._channels.forEach((c) => {
            c.removeUser(this);
        });
        this.socket.close();
        clients.splice(clients.indexOf(this), 1);
        delete this;
    };


    /**
     * find a client in user list
     * @param id
     * @returns {null|Client}
     */
    static find(id) {
        for(let key in clients) {
            if( key === id || clients[key].name === id || client[key].id === id) {
                return clients[key];
            }
        }
        return null;
    }

    /**
     * get client list
     * @returns {Array}
     */
    static list() {
        return clients;
    }

}

module.exports = Client;