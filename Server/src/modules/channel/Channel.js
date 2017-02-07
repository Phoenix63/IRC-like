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
        this.usersFlags = {};

        this.invitation = [];



        this._name = name;

        if(this._name === '') {
            delete this;
            return;
        }



        channels.push(this);

        this.addUser(creator, pass);

    }

    get name() {
        return this._name;
    }

    /**
     * return user list of this channel
     * @returns {Array}
     */
    get users() {
        let list = [];
        for(let key in this.usersFlags) {
            list.push(this.usersFlags[key].client);
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
        user.channels.push(this);
        if(this.users.length === 0) {
            this.creator = user;
            this.usersFlags[user.id] = {
                client: user,
                flags: 'omvw'
            };
        } else {
            this.usersFlags[user.id] = {
                client: user,
                flags: ''
            };
        }


        user.channels.push(this);
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
                if(this.usersFlags[u.id].flags.indexOf('o')>=0 && !this.creator) {
                    this.creator = u;
                }
            });
        }

        RPLSender.PART(user, this);
        user.channels.splice(user.channels.indexOf(this),1);

        delete this.usersFlags[user];
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
     * get channel list
     * @returns {Array<Channel>}
     */
    static list() {
        return channels;
    }

}

module.exports = Channel;