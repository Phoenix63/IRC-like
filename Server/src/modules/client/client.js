"use strict"

import shortid from 'shortid';
import Socket from './../socket/socket';
import ERRSender from './../responses/ERRSender';
import RPLSender from './../responses/RPLSender';
import crypto from 'crypto';

import Redis from '../data/RedisInterface';
let redisClient = Redis.instance;


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
        /**
         i - marque un utilisateur comme invisible ;
         s - marque un utilisateur comme recevant les notifications du serveur ;
         w - l'utilisateur reçoit les WALLOPs ;
         o - drapeau d'opérateur.
         */
        this._flag = '';
        this.addFlag('sw');
        this._channels = [];
        this._pass = '';
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
     * set loggin password
     * @param {string} val
     */
    set pass(val) {
        this._pass = crypto.createHash('sha256').update(val).digest('base64');
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
        return (this._realname !== null) && (this._name !== null) && (this._identity !== null);
    }

    /**
     * change identity of user if its valid
     * @param {string} identity
     */
    setIdentity(identity) {
        //TODO test this fonctionnality

        if(this._identity) {
            ERRSender.ERR_ALREADYREGISTRED(this);
            return false;
        }

        clients.forEach((c) => {
            if ((this._pass && c.identity === identity)
                || (!this._pass && c.identity === 'GUEST_'+identity)) {
                ERRSender.ERR_ALREADYREGISTRED(this);
                return false;
            }
        });

        let match = identity.match(/[a-zA-Z0-9_-é"'ëäïöüâêîôûç`è]+/);
        if (!match || (match && match[0] !== identity ) || identity === '' || identity.length > 15 || identity.indexOf('GUEST_') >= 0) {
            ERRSender.ERR_NEEDMOREPARAMS(this, 'USER');
            return false;
        }

        // command USER valid
        if(this._pass) {
            // user should not be a guest
            redisClient.getPass(identity, (err, pass) => {
                if(!err && pass != this._pass) {
                    ERRSender.ERR_PASSWDMISMATCH(this);
                    return false;
                }  else {
                    if(err) {
                        redisClient.setPass(identity, this._pass);
                    }

                    this._identity = identity;
                    this._socket.logger._CLIENT_LOGGED();

                    RPLSender.RPL_MOTDSTART(this.socket);
                    RPLSender.RPL_MOTD(this.socket);
                    RPLSender.RPL_ENDOFMOTD(this.socket);

                    redisClient.getAdmin((reply) => {
                        if (!reply) {
                            this._socket.logger._CLIENT_IS_NOW_ADMIN();
                            this.addFlag('o');
                            redisClient.setAdmin(this);
                        } else if (reply === identity) {
                            this._socket.logger._CLIENT_IS_NOW_ADMIN();
                            this.addFlag('o');
                        }
                    });

                }
            });
        } else {
            this._identity = 'GUEST_' + identity;
            this._socket.logger._CLIENT_GUEST();
            RPLSender.RPL_MOTDSTART(this.socket);
            RPLSender.RPL_MOTD(this.socket);
            RPLSender.RPL_ENDOFMOTD(this.socket);
        }
        return true;
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
        if (!match || (match && match[0] !== name) || name === '' || name.length > 15) {
            ERRSender.ERR_NONICKNAMEGIVEN(this);
            error = true;
        }
        if (!error) {
            this.socket.logger._USER_CHANGE_NICK(name);
            this._name = name;
            RPLSender.NICK(name, this);
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
     *
     * @param {string} flag
     */
    addFlag(flag) {
        if(this._flag.indexOf(flag)<0) {
            this._flag += flag;
        }
    }

    /**
     *
     * @param {string} flag
     */
    removeFlag(flag) {
        if(this._flag.indexOf(flag)>=0) {
            this._flag = this._flag.split(flag).join('');
        }
    }

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