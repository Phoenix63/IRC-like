"use strict";

import tcp from './tcp';
import sio from './sio';
import shortid from 'shortid';
import config from './../../config.json';
import Redis from './../data/RedisInterface';
let debug = require('debug')('pandirc:socket');

let sockets = [];
let bannedIP = {};

const interval = config.timeout*1000;

class Socket {
    /**
     *
     * @param {string} type
     * @param {sio|tcp} soc
     */
    constructor(type, soc) {
        this._id = '__' + shortid.generate();
        this._type = type;
        this._socket = soc;
        this._client = null;
        this._logger = null;
        this._messageManager = null;
        sockets.push(this);
        this._onSignal = {};

        this._life = 1;
        if (interval > 0) {
            this._interval = setInterval(() => {
                if (this._life <= 0) {
                    this._socket.destroy();
                } else {
                    this._life--;
                    this.send(':' + config.ip + ' PING :' + shortid.generate());
                }
            }, interval);
        }

    }

    /**
     *
     * @returns {sio|tcp|null}
     */
    get socket() {
        return this._socket;
    }

    /**
     *
     * @returns {string}
     */
    get type() {
        return this._type;
    }

    /**
     *
     * @returns {Client|null}
     */
    get client() {
        return this._client;
    }

    /**
     *
     * @returns {Logger|null}
     */
    get logger() {
        return this._logger;
    }

    /**
     *
     * @param {Client|null} cli
     */
    set client(cli) {
        this._client = cli;
    }

    /**
     *
     * @param {Logger|null} log
     */
    set logger(log) {
        this._logger = log;
    }

    /**
     *
     * @returns {boolean}
     */
    get isTcp() {
        return this._type === 'tcp';
    }

    /**
     *
     * @param {string} data
     */
    send(data) {
        if (this._logger)
            this._logger._SEND_TO_CLIENT(data);
        if (this.isTcp) {
            this._socket.write(data + '\n\r');
        } else {
            this._socket.emit('message', data);
        }
    }

    /**
     *
     * @param {string} str
     * @param {Socket} except
     */
    broadcast(str, except) {
        sockets.forEach((s) => {
            if (!except || except !== s) {
                s.send(str);
            }
        });
    }

    /**
     *
     * @param {string} event
     * @param {function} callback
     */
    on(event, callback) {
        this._onSignal[event] = callback;
    }

    /**
     *
     * @param {string} event
     * @param {string} data
     */
    emit(event, data) {
        this._life = 1;

        if (this._onSignal[event]) {
            this._onSignal[event](data);
        }
    }


    onClose() {
        clearInterval(this._interval);
        if (this._client) {
            this._client.remove();
        }
        if (this._logger) {
            this._logger._CLIENT_DISCONNECTED();
        }
        sockets.splice(sockets.indexOf(this), 1);
        delete this;
    }

    close() {
        if (this.isTcp){
            this.socket.destroy();
        }else{
            this.socket.disconnect(true);
        }
    }

    get ip() {
        return this.isTcp ? this._socket.remoteAddress : this._socket.handshake.address;
    }

    static create(callback) {
        sio.create(function (socket) {
            let soc = new Socket('sio', socket);
            socket.manager = soc;
            callback(soc);
        });
        tcp.create(function (socket) {
            let soc = new Socket('tcp', socket);
            socket.manager = soc;
            callback(soc);
        });
    }
    static isBan(ip){
        if (bannedIP[ip] && bannedIP[ip] > Date.now()) {
            return true;
        } else {
            delete bannedIP[ip];
            Redis.setBannedIP(bannedIP);
            return false;
        }
    }
    static unBan(ip){
        if(bannedIP[ip]){
            delete bannedIP[ip];
            Redis.setBannedIP(bannedIP);
        }
    }
    static ban(userBanned, banishmentTime){
        let banDuration = parseInt(banishmentTime) * 1000;//millisecond
        let endTimeOfBan = Date.now() + banDuration;
        bannedIP[userBanned.ip] = endTimeOfBan;
        userBanned.socket.close();
        Redis.setBannedIP(bannedIP);
    }

    static setBan(ipban){
        bannedIP = ipban;
        Redis.setBannedIP(bannedIP);
    }
    static list(){
        return sockets;
    }

    static updateList(obj) {
        bannedIP = obj;
    }

    static getBannedIP() {
        return bannedIP;
    }
}


export default Socket;
