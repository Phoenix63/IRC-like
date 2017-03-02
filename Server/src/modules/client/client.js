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
         s - drapeau super admin
         */
        this._flags = '';
        this._addFlag('sw');
        this._channels = [];
        this._pass = '';
        this._registeredWithPass = false;
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
        if(val[0] === ':') {
            val = val.slice(1, val.length);
        }
        this._realname = val;
    }

    /**
     * return true if user is registered / else false
     * @returns {boolean}
     */
    get isRegistered() {
        return this._identity !== null;
    }

    /**
     * change identity of user if its valid
     * @param {string} identity
     */
    setIdentity(identity, realname) {

        let error = false;

        if(this._identity) {
            ERRSender.ERR_ALREADYREGISTRED(this);
            error = true;
        }

        clients.forEach((c) => {
            if ((this._pass && c.identity === identity)
                || (!this._pass && c.identity === 'GUEST_'+identity)) {
                ERRSender.ERR_ALREADYREGISTRED(this);
                error = true;
            }
        });

        let match = identity.match(/[a-zA-Z0-9_-é"'ëäïöüâêîôûç`è]+/);
        if (!match || (match && match[0] !== identity ) || identity === '' || identity.length > 15 || identity.indexOf('GUEST_') >= 0) {
            ERRSender.ERR_NEEDMOREPARAMS(this, 'USER');
            error = true;
        }

        if(!error) {
            // command USER valid
            if(this._pass) {
                // user should not be a guest
                redisClient.getPass(identity, (err, pass) => {
                    if(!err && pass != this._pass) {
                        ERRSender.ERR_PASSWDMISMATCH(this);
                    }  else {
                        if(err) {
                            redisClient.addUser(identity, this._pass);
                        }
                        this._registeredWithPass = true;

                        this._identity = identity;
                        this._realname = realname;
                        this._socket.logger._CLIENT_LOGGED();

                        RPLSender.RPL_MOTDSTART(this.socket);
                        RPLSender.RPL_MOTD(this.socket);
                        RPLSender.RPL_ENDOFMOTD(this.socket);

                        if(process.argv[2] === 'TEST') {
                            this._socket.logger._CLIENT_IS_NOW_ADMIN();
                            this._addFlag('o');
                        } else {
                            redisClient.getAdmin((reply) => {
                                if (!reply) {
                                    this._socket.logger._CLIENT_IS_NOW_ADMIN();
                                    this._addFlag('Oo');
                                    redisClient.setAdmin({identity: this.identity, role: 'superadmin'});
                                } else if (reply[identity] === 'admin') {
                                    this._socket.logger._CLIENT_IS_NOW_ADMIN();
                                    this._addFlag('o');
                                } else if (reply[identity] === 'superadmin') {
                                    this._socket.logger._CLIENT_IS_NOW_ADMIN();
                                    this._addFlag('Oo');
                                }
                            });
                        }


                    }
                });
            } else {
                this._identity = 'GUEST_' + identity;
                this._realname = realname;

                this._socket.logger._CLIENT_GUEST();
                RPLSender.RPL_MOTDSTART(this.socket);
                RPLSender.RPL_MOTD(this.socket);
                RPLSender.RPL_ENDOFMOTD(this.socket);
            }
        }

    }

    /**
     * set the user name
     * @param {string} name
     */
    set name(name) {
        let error = false;
        if(name === null) {
            this.socket.logger._USER_CHANGE_NICK('Guest_'+this._id);
            RPLSender.NICK(this.name, 'Guest_'+this._id, this);
            this._name = null;
            error = true;
        } else {
            if (name[0] === ':') {
                name = name.slice(1, name.length);
            }



            clients.forEach((c) => {
                if (c.name === name) {
                    if(!c.isUser() && this.isUser()) {
                        c.name = null;
                    } else {
                        ERRSender.ERR_NICKNAMEINUSE(this);
                        error = true;
                    }
                }
            });

            let match = name.match(/[a-zA-Z0-9_-é"'ëäïöüâêîôûç`è]+/);
            if (!match || (match && match[0] !== name) || name === '' || name.length > 15) {
                ERRSender.ERR_NONICKNAMEGIVEN(this);
                error = true;
            }
            if (!error) {
                this.socket.logger._USER_CHANGE_NICK(name);
                RPLSender.NICK(this.name, name, this);
                this._name = name;
            }
        }


    }

    /*
     * methods
     */

    del() {
        for(let i = 0; i<this._channels.length; i++) {
            this._channels[i].removeUser(this, 'Quit', true);
        }
        RPLSender.QUIT(this, 'Gone');
        clients.splice(clients.indexOf(this), 1);
    };

    /**
     *
     * @param {string} flags
     * @private
     */
    _addFlag(flags) {
        let arrayFlags = flags.split('');
        arrayFlags.forEach((flag) => {
            if(this._flags.indexOf(flag)===-1){
                this._flags += flag;
                RPLSender.RPL_UMODEIS(this,this.name+' +'+flag);
            }
        });
    }

    /**
     *
     * @param {string} flags
     * @private
     */
    _removeFlag(flags) {
        let arrayFlags = flags.split('');
        arrayFlags.forEach((flag) => {
            let tmp = this._flags.length;
            this._flags = this._flags.replace(flag,'');
            if(tmp-1 === this._flags.length){
                RPLSender.RPL_UMODEIS(this,this.name+' -'+flag);
            }
        });
    }

    /**
     *
     * @param {string} operator
     * @param {string} flag
     */
    changeFlag(operator, flag) {
        if(operator==='+') {
            this._addFlag(flag);
        }else {
            this._removeFlag(flag);
        }
    }

    /**
     *
     * @returns {boolean}
     */
    isUser() {
        return this._registeredWithPass;
    }

    /**
     *
     * @returns {boolean}
     */
    isAdmin() {
        return this._flags.indexOf('o')>=0;
    }

    /**
     *
     * @returns {boolean}
     */
    isSuperAdmin(){
        return this._flags.indexOf('O')>=0;
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
     * @param {string} id
     * @returns {null|Client}
     */
    static getClient(id) {
        for (let key in clients) {
            if (key === id || clients[key].name === id || clients[key].id === id) {
                return clients[key];
            }
        }
        return null;
    }

    /**
     * get client list
     * @returns {Array<Client>}
     */
    static list() {
        return clients;
    }

}
export default Client;