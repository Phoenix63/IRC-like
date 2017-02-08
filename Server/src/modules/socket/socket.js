"use strict"

import tcp from './tcp';
import sio from './sio';
import shortid from 'shortid';

let sockets = [];

class Socket {
    /**
     *
     * @param {string} type
     * @param {sio|tcp} soc
     */
    constructor(type, soc) {
        this._id = '__'+shortid.generate();
        this._type = type;
        this._socket = soc;
        this._client = null;
        this._logger = null;
        this._messageManager = null;

        sockets.push(this);

        this._onSignal = {};
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
        if(this._logger)
            this._logger._SEND_TO_CLIENT(data);
        if(this.isTcp) {
            this._socket.write(data+'\n\r');
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
            if(except !== s) {
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
        if(this._onSignal[event])
            this._onSignal[event](data);
    }

    /**
     * delete socket
     */
    close() {
        this._socket.destroy();
        sockets.splice(sockets.indexOf(this), 1);
        delete this;
    }

}

function create(callback) {
    tcp.create(function(socket) {
        let soc = new Socket('tcp', socket);
        socket.manager = soc;
        callback(soc);
    });
    sio.create(function(socket) {
        let soc = new Socket('sio', socket);
        socket.manager = soc;
        callback(soc);
    })
}

export default {create: create};
