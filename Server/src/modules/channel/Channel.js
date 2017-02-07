"use strict";

import shortid from 'shortid';
import err from './../SignalManager';
import config from './../../config.json';

let channels = [];

class Channel {

    constructor(creator, name, pass, maxSize) {
        if(!typeof maxSize === "number") {
            err.ERR_NOSUCHCHANNEL(creator);
            delete this;
            return;
        }
        this.flags = 'tn';
        this.id = shortid.generate();
        this.creator = creator;
        this.pass = pass;
        this.maxSize = maxSize;

        this.bannedUsers = [];
        this.usersFlags = {};

        this.invitation = [];

        this.usersFlags[creator.id] = {
            client: creator,
            flags: 'omvw'
        };

        creator.channels.push(this);


        this.name = '';
        this.setName(creator, name);

        if(this.name === '') {
            delete this;
            return;
        }

        channels.push(this);

        this.broadcast(':'+creator.name+' JOIN '+this.name);

    }

    get users() {
        let list = [];
        for(let key in this.usersFlags) {
            list.push(this.usersFlags[key].client);
        }
        return list;
    }

    RPL_NAMREPLY(socket) {
        let sep = '=';
        if(this._isSecret)
            sep = '@';
        if(this._isPrivate)
            sep = '*';

        let ret = ':'+config.ip+' 353 '+ socket.client.name +' '+sep+' '+this.name;
        let us = '';
        this.users.forEach((u) => {
            var delimiter = '';
            if(this.usersFlags[u.id].flags.indexOf('o')>=0) {
                delimiter = '@';
            } else if (this.usersFlags[u.id].flags.indexOf('v')>=0) {
                delimiter = '+';
            }
            us += ' '+delimiter+this.usersFlags[u.id].client.name;

        });

        if(us) {
            socket.send(ret+(us?' :'+us.slice(1,us.length):''));
        }
        socket.send(':'+config.ip+' 366 '+ socket.client.name +' :End of /NAMES list');
    }


    setName(op, name) {

        if(!this.usersFlags[op.id] || this.usersFlags[op.id].flags<0) {
            err.ERR_NOTOPONCHANNEL(op.socket);
            return;
        }

        if(name[0] !== '#') {
            name = '#'+name;
        }
        var error = false;
        channels.forEach((chan) => {
            if(chan.name === name) {
                error = true;
            }
        });
        if(error) {
            err.ERR_NOSUCHCHANNEL(op.socket);
            return;
        }
        this.name = name;
    }

    addUser(user, key) {
        if(this.bannedUsers.indexOf(user)>=0) {
            err.ERR_BANNEDFROMCHAN(user.socket);
            return;
        }
        if(this._isInvitation && this.invitation.indexOf(user) === -1) {
            err.ERR_INVITEONLYCHAN(user.socket);
            return;
        }
        if(key !== this.pass) {
            err.ERR_BADCHANNELKEY(user.socket);
            return;
        }
        if(this.users.length >= this.maxSize) {
            err.ERR_CHANNELISFULL(user.socket);
            return;
        }
        user.channels.push(this);
        this.usersFlags[user.id] = {
            client: user,
            flags: ''
        };

        this.broadcast(':'+user.name+' JOIN '+this.name);
    }

    removeUser(user) {

        if(this.users.indexOf(user)<0) {
            err.ERR_NOTONCHANNEL(user.socket);
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

        this.broadcast(':'+user.name+' PART '+this.name);
        user.channels.splice(user.channels.indexOf(this),1);

        delete this.usersFlags[user];
        if(this.users.length <= 0 || !this.creator) {
            channels.splice(channels.indexOf(this), 1);
            delete this;
        }
    }

    broadcast(message, except) {
        this.users.forEach((u) => {
            if(u !== except)
                u.socket.send(message);
        });
    }

    RPL_WHOREPLY(socket) {
        this.users.forEach((u) => {
            var delimiter = '';
            if(this.usersFlags[u.id].flags.indexOf('o')>=0) {
                delimiter = '@';
            } else if (this.usersFlags[u.id].flags.indexOf('v')>=0) {
                delimiter = '+';
            }
            socket.send(
                ':'+config.ip+' 352 '+socket.client.name+' '+this.name+' ~'
                +u.identity+' '+u.ip+' '+config.ip+' '+u.name+ ' '
                +(u.away?'G':'H')
                + delimiter + ' :0 '+u.rname);


        });
        socket.send(':'+config.ip+' 315 '+socket.client.name+' '+this.name+' :End of /WHO list');

    }



    get _isPrivate() {
        return (this.flags.indexOf('p')>=0);
    }

    get _isSecret() {
        return (this.flags.indexOf('s')>=0);
    }
    get _isInviation() {
        return (this.flags.indexOf('i')>=0);
    }

    static list() {
        return channels;
    }

}

module.exports = Channel;