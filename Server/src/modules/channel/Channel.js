"use strict";

import shortid from 'shortid';
import Client from './../client/client';

import ERRSender from './../responses/ERRSender';
import RPLSender from './../responses/RPLSender';

let channels = [];

class Channel {

    /**
     *
     * @param {Client} creator
     * @param {string} name
     * @param {string} pass
     * @param {number} maxSize
     * @constructor
     */
    constructor(creator, name, pass, maxSize) {
        this.flags = 'tn';
        this.id = shortid.generate();
        this.creator = creator;
        this.pass = pass;
        this.maxSize = maxSize;

        this.bannedUsers = [];
        this._usersFlags = {};

        this.invitation = [];



        this._name = name;

        if(this._name === '') {
            delete this;
            return;
        }



        channels.push(this);

        this.addUser(creator, pass);

    }

    /**
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     *
     * @returns {*}
     */
    get usersFlags() {
        return this._usersFlags;
    }

    /**
     * return user list of this channel
     * @returns {Array}
     */
    get users() {
        let list = [];
        for(let key in this._usersFlags) {
            list.push(this._usersFlags[key].client);
        }
        return list;
    }

    /**
     * get status private for the channel, true = private / false = public
     * @returns {boolean}
     */
    get isPrivate() {
        return (this.flags.indexOf('p')>=0);
    }

    /**
     * return status secret for the channel, true = isSecret / false = visible
     * @returns {boolean}
     */
    get isSecret() {
        return (this.flags.indexOf('s')>=0);
    }

    /**
     * return status invitation for the channel, true = isInvitation only / false = accessible
     * @returns {boolean}
     */
    get isInvitation() {
        return (this.flags.indexOf('i')>=0);
    }

    /**
     * return true if the clinet is operator
     * @param {Client} client
     * @returns {boolean}
     */
    isOperator(client) {
        if(this._usersFlags[client.id] && this._usersFlags[client.id].flags.indexOf('o')>=0)
            return true;
        return false;
    }

    /**
     * return true if the client is voice
     * @param {Client} client
     * @returns {boolean}
     */
    isVoice(client) {
        if(this._usersFlags[client.id] && this._usersFlags[client.id].flags.indexOf('v')>=0)
            return true;
        return false;
    }

    /**
     * add user to the channel
     * @param {Client} user
     * @param {string} key
     */
    addUser(user, key) {
        if(this.bannedUsers.indexOf(user)>=0) {
            ERRSender.ERR_BANNEDFROMCHAN(user, this);
            return;
        }
        if(this._isInvitation && this.isInvitation.indexOf(user) === -1) {
            ERRSender.ERR_INVITEONLYCHAN(user, this);
            return;
        }
        if(key !== this.pass) {
            ERRSender.ERR_BADCHANNELKEY(user, this);
            return;
        }
        if(this.users.length >= this.maxSize) {
            ERRSender.ERR_CHANNELISFULL(user, this);
            return;
        }

        if(this.users.length === 0) {
            this.creator = user;
            this._usersFlags[user.id] = {
                client: user,
                flags: 'omvw'
            };
        } else {
            this._usersFlags[user.id] = {
                client: user,
                flags: ''
            };
        }


        user.addChannel(this);
        RPLSender.JOIN(user, this);
        RPLSender.RPL_TOPIC(user, this);
        RPLSender.RPL_NAMREPLY(user, this);
    }

    /**
     * remove user from this channel
     * @param {Client} user
     */
    removeUser(user) {
        if(this.users.indexOf(user)<0) {
            ERRSender.ERR_NOTONCHANNEL(user, this);
            return;
        }


        if(user === this.creator) {
            this.creator = null;
            this.users.forEach((u) => {
                if(this._usersFlags[u.id].flags.indexOf('o')>=0 && !this.creator) {
                    this.creator = u;
                    this._usersFlags[u.id].flags = 'omvw';
                }
            });
        }

        RPLSender.PART(user, this);
        user.removeChannel(this);

        delete this._usersFlags[user.id];
        if(this.users.length <= 0 || !this.creator) {
            channels.splice(channels.indexOf(this), 1);
            delete this;
        }

    }

    /**
     * Broadcast message to this channel, if except is defined this client don't receive the message
     * @param {string} message
     * @param {Client} except
     */
    broadcast(message, except) {
        this.users.forEach((u) => {
            if(u !== except)
                u.socket.send(message);
        });
    }

    /**
     *
     * @returns {Array<Channel>}
     */
    static list() {
        return channels;
    }

}

export default Channel;