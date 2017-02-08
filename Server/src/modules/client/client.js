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
     *
     * @returns {Array<Channel>}
     */
    get channels() {
        return this._channels;
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
        return this._identity || 'Guest_' + this._id;
    }

    /**
     * get user name, may be Guest_<id> if not defined
     * @returns {string}
     */
    get name() {
        return this._name || 'Guest_' + this._id;
    }

    /**
     * get user realname, may be Guest_<id> if not defined
     * @returns {string}
     */
    get realname() {
        return this._realname || 'Guest_' + this._id;
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
     * change identity of user if its valid
     * @param {string} identity
     */
    set identity(identity) {
        if (!this._identity) {
            let error = false;
            clients.forEach((c) => {
                if (c.identity === identity) {
                    ERRSender.ERR_NEEDMOREPARAMS(this);
                    error = true;
                }
            });

            let match = identity.match(/[a-zA-Z0-9_-é"'ëäïöüâêîôûç`è]+/);
            if (match && match[0] !== identity && identity === '' || identity.length > 15) {
                ERRSender.ERR_NEEDMOREPARAMS(this, 'USER');
                error = true;
            }
            if(!error) {
                this._identity = identity;
            }

        }

    }

    /**
     * set the user name
     * @param {string} name
     */
    set name(name) {
        if (name[0] === ':') {
            name = name.slice(1, name.length);
        }

        let error = false;

        clients.forEach((c) => {
            if (c.name === name) {
                ERRSender.ERR_NICKNAMEINUSE(this);
                error = true;
            }
        });

        let match = name.match(/[a-zA-Z0-9_-é"'ëäïöüâêîôûç`è]+/);
        if ((match && match[0] !== name) || name === '' || name.length > 15) {
            ERRSender.ERR_NONICKNAMEGIVEN(this);
            error = true;
        }
        if(!error) {
            this.socket.logger._USER_CHANGE_NICK(name);
            RPLSender.NICK(this);
            this._name = name;
        }

    }

    /*
     * methods
     */

    /**
     * delete the current user
     *
     */
    delete() {
        this._channels.forEach((c) => {
            c.removeUser(this);
        });
        clients.splice(clients.indexOf(this), 1);
        delete this;
    };

    /**
     * remove channel from list
     * @param {Channel} channel
     */
    removeChannel(channel) {
        this._channels.splice(this._channels.indexOf(channel), 1);
    }

    /**
     * add channel from list
     * @param {Channel} channel
     */
    addChannel(channel) {
        this._channels.push(channel);
    }


    /**
     * find a client in user list
     * @param id
     * @returns {null|Client}
     */
    static find(id) {
        for (let key in clients) {
            if (key === id || clients[key].name === id || client[key].id === id) {
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
export default Client;