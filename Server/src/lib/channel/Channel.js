"use strict";

import Client from '../client/Client';
import ERRSender from './../responses/ERRSender';
import RPLSender from './../responses/RPLSender';
import Redis from './../data/RedisInterface';

let channels = [];


class Channel {

    /**
     *
     * @param {Client|Object} creator
     * @param {string} name
     * @param {string} pass
     * @param {number} size
     * @param {string} topic
     * @constructor
     */
    constructor(creator, name, pass, size, topic = '') {
        /**
         *  s       canal secret; le canal est totalement invisible
         *  p       canal privé; le nom du canal est invisible
         *  n       les messages externes ne sont pas autorisés
         *  m       canal modéré, seuls les utilisateurs en mode +v et les opérateurs peuvent envoyer un message
         *  i       canal accessible uniquement sur invitation (commande /invite)
         *  t       sujet du canal uniquement modifiable par les opérateurs du canal
         *
         *  o    +  nom de l'utilisateur concerné    Opérateur de canal : peut changer les modes du channel et expulser les autres utilisateurs
         *  v    +  nom de l'utilisateur concerné    verbose ou voiced : autorise l'utilisateur à parler sur un canal modéré (mode +m)
         */
        this._flags = '';
        this._usersFlags = {};
        this._pass = pass || '';
        this._size = size;
        this._bannedIP = {};//key = ip, value = endTimeOfBan(ms)
        this._users = [];
        this._creator = creator.identity;
        this._invitations = [];
        this._name = name;
        this._persistent = false;
        this._topic = topic;
        this._files = {};
        this._savedMessages = [];

        if (this._pass.length > 0) {
            this._addChannelFlag('p');
        }

        // not loaded from mongo
        if (creator instanceof Client) {
            if (creator.isAdmin() || creator.isSuperAdmin()) {
                this.setPersistent(true);
            }
            //this.addUser(creator, pass);
            this._addChannelFlag('tn');
        }
        //load from mongo
        else {
            this.setPersistent(true);
        }
        if(this.name[0] === '#') {
            channels.push(this);
        }

    }

    addMessage(user, message) {
        if(this._savedMessages.length > 10) {
            this._savedMessages.shift();
        }
        this._savedMessages.push({
            user: user,
            message: message
        });
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
     * @returns {string|NULL}
     */
    get topic() {
        if (this._topic !== '') {
            return this._topic;
        } else {
            return null;
        }
    }

    /**
     * return user list of this channel
     * @returns {Array}
     */
    get users() {
        return this._users;
    }

    /**
     *
     * @param {number|string|Client} id -> identifiant|nickname|client
     * @returns {null|Client}
     */
    getUser(id) {
        for (let j = 0; j < this._users.length; j++) {
            if (this._users[j] === id || this._users[j].identity === id || this._users[j].name === id) {
                return this._users[j];
            }
        }
        return null;
    }

    /**
     * get status private for the channel, true = private / false = public
     * @returns {boolean}
     */
    get isPrivate() {
        return (this._flags.indexOf('p') >= 0);
    }

    /**
     * return status secret for the channel, true = isSecret / false = visible
     * @returns {boolean}
     */
    get isSecret() {
        return (this._flags.indexOf('s') >= 0);
    }

    /**
     * return status invitation for the channel, true = isInvitation only / false = accessible
     * @returns {boolean}
     */
    get isInvitation() {
        return (this._flags.indexOf('i') >= 0);
    }

    /**
     *
     * @returns {boolean}
     */
    get isModerated() {
        return (this._flags.indexOf('m') >= 0);
    }

    /**
     *
     * @returns {string}
     */
    get pass() {
        return this._pass;
    }

    /**
     *
     * @returns {number}
     */
    get size() {
        return this._size;
    }

    /**
     *
     * @returns {boolean}
     */
    get isFull() {
        return this._users.length >= this._size;
    }

    /**
     * return true if the client is voice
     * @param {Client} client
     * @returns {boolean}
     */
    isUserVoice(client) {
        return this._usersFlags[client.identity].indexOf('v') >= 0;
    }

    /**
     *
     * @returns {Client|Object}
     */
    get creator() {
        return this._creator;
    }

    /**
     *
     * @returns {string}
     */
    get channelFlags() {
        return this._flags;
    }

    /**
     *
     * @returns {{}}
     */
    get bannedIP() {
        return this._bannedIP;
    }

    /**
     *
     * @param {{}} bannedIP
     */
    set bannedIP(bannedIP) {
        this._bannedIP = bannedIP;
        this._mergeToRedis();
    }

    /**
     *if the channel is persistent, ie if it is created by an administrator, we save in redis
     * @private
     */
    _mergeToRedis() {
        if (this._persistent && this.name[0] === '#') {
            Redis.setChannel(this);
        }
    }

    /**
     * set channel persistent or not
     * @param {Boolean} bool
     */
    setPersistent(bool) {
        this._persistent = bool;
        if (bool) {
            Redis.setChannel(this);
        } else {
            Redis.deleteChannel(this);
        }
    }

    /**
     *if the channel is persistent, ie if it is created by an administrator, we save in redis
     * @private
     */


    /**
     *
     * @param {string|NULL} newTopic
     */
    set topic(newTopic) {
        this._topic = newTopic;
        this._mergeToRedis();
    }

    /**
     *
     * @param {Client} client
     * @param {string} url
     */
    addFile(client, url) {
        let split = url.split('/');
        this._files[url] = {
            name: split[split.length - 1],
            client: client
        };
    }

    /**
     *
     * @returns {Array<Client, string>}
     */
    getFiles() {
        return this._files;
    }

    removeFile(url) {
        delete this._files[url];
    }

    deleteFiles() {
        this._files = {};
    }

    remove() {

        this._persistent = false;
        if(this._users.length > 0) {
            while(this._users.length > 0) {
                this.removeUser(this._users[0]);
            }
        } else {
            channels.splice(channels.indexOf(this), 1);
        }


        Redis.deleteChannel(this);
    }

    /**
     * @param {Client} client
     * @param {string} flags
     * @private
     */
    _addClientFlag(client, flags) {
        let arrayFlags = flags.split('');
        arrayFlags.forEach((flag) => {
            if(flag !== 'o' || (flag === 'o' && client.isRegisteredWithPass())) {
                if (this._usersFlags[client.identity].indexOf(flag) === -1) {
                    this._usersFlags[client.identity] += flag;
                    RPLSender.RPL_CHANNELMODEIS(this, this._name + ' +' + flag + ' ' + client.name);
                }
            }
        });
        this._mergeToRedis();
    }

    /**
     *
     * @param {Client} client
     * @param {string} flags
     * @private
     */
    _removeClientFlag(client, flags) {
        let arrayFlags = flags.split('');
        arrayFlags.forEach((flag) => {
            let tmp = this._usersFlags[client.identity].length;
            this._usersFlags[client.identity] = this._usersFlags[client.identity].replace(flag, '');
            if (tmp - 1 === this._usersFlags[client.identity].length) {
                RPLSender.RPL_CHANNELMODEIS(this, this._name + ' -' + flag + ' ' + client.name);
            }
        });
        this._mergeToRedis();
    }

    /**
     *
     * @param {String} flags
     * @private
     */
    _addChannelFlag(flags) {
        let arrayFlags = flags.split('');
        arrayFlags.forEach((flag) => {
            if (this._flags.indexOf(flag) === -1) {
                this._flags += flag;
                RPLSender.RPL_CHANNELMODEIS(this, this._name + ' +' + flag);
            }
        });
        this._mergeToRedis();
    }

    /**
     *
     * @param {String} flags
     * @private
     */
    _removeChannelFlag(flags) {
        let arrayFlags = flags.split('');
        arrayFlags.forEach((flag) => {
            let tmp = this._flags.length;
            this._flags = this._flags.replace(flag, '');
            if (tmp - 1 === this._flags.length) {
                RPLSender.RPL_CHANNELMODEIS(this, this._name + ' -' + flag);
            }
        });
        this._mergeToRedis();
    }

    /**
     *
     * @param {string} operator
     * @param {string} flag
     * @param {Client} client
     */
    changeClientFlag(operator, flag, client) {
        if (operator === '+') {
            this._addClientFlag(client, flag);
        } else {
            this._removeClientFlag(client, flag);
        }
    }

    /**
     *
     * @param {string} operator
     * @param {string} flag
     */
    changeChannelFlag(operator, flag) {
        if (operator === '+') {
            this._addChannelFlag(flag);
        } else {
            this._removeChannelFlag(flag);
        }
    }

    /**
     *
     * @param {Client} client
     * @returns {boolean}
     */
    isUserOperator(client) {
        if (this._usersFlags[client.identity] && this._usersFlags[client.identity].indexOf('o') >= 0) {
            return true;
        } else if (!this._persistent && client.identity === this._creator) {
            return true;
        }
        return false;
    }

    /**
     *
     * @param {{}} flags
     */
    set usersFlags(flags) {
        this._usersFlags = flags;
        this._mergeToRedis();
    }

    /**
     *
     * @param {string} flags
     */
    set flags(flags) {
        this._flags = flags;
        this._mergeToRedis();
    }


    /**
     * add user to the channel
     * @param {Client} user
     * @param {string} key
     */
    addUser(user, key = '') {
        if (this._isBan(user)) {
            ERRSender.ERR_BANNEDFROMCHAN(user, this);
            return;
        }
        if (this.isInvitation && this._invitations.indexOf(user.identity) === -1 && user.identity !== this.creator) {
            ERRSender.ERR_INVITEONLYCHAN(user, this);
            return;
        }
        if (key !== this._pass) {
            ERRSender.ERR_BADCHANNELKEY(user, this);
            return;
        }
        if (this.users.length >= this.size) {
            ERRSender.ERR_CHANNELISFULL(user, this);
            return;
        }
        if (this._users.indexOf(user) < 0) {
            this._users.push(user);

            if (!this._usersFlags[user.identity]) {
                this._usersFlags[user.identity] = '';
            }


            user.addChannel(this);

            RPLSender.JOIN(user, this);
            RPLSender.RPL_TOPIC('JOIN', user, this);
            RPLSender.RPL_NAMREPLY(user, this);

            if (this._users.length === 1) {
                this._addClientFlag(user, 'o');
            }

            if (user.isAdmin() || user.isSuperAdmin() || user.identity === this._creator) {
                this._addClientFlag(user, 'o');
            }

            this._flags.split('').forEach((flag) => {
                RPLSender.RPL_CHANNELMODEIS(this, this._name + ' +' + flag, user);
            });

            this._mergeToRedis();
            this._savedMessages.forEach((arr) => {
                RPLSender.PRIVMSG(arr.user.socket, this, arr.message, user);
            });
        }
    }

    /**
     * remove user from this channel
     * @param {Client} user
     * @param {string} message
     */
    removeUser(user, message = 'Gone', bool) {
        let index = this._users.indexOf(user);
        if (index < 0) {
            ERRSender.ERR_NOTONCHANNEL(user, this);
        } else {
            this._users.splice(index, 1);
            if(this._usersFlags[user.identity] && !user.isRegisteredWithPass()) {
                delete this._usersFlags[user.identity];
            }
            RPLSender.PART(user, this, message);

            if (!bool) {
                user.removeChannel(this);
            }

            if(!this._persistent && this._creator === user.identity) {
                this._creator = '##### NONE ####';
            }

            if (!this._persistent && this._users.length <= 0) {
                channels.splice(channels.indexOf(this), 1);
            }
        }
    }

    /**
     *
     * @param {string} size
     */
    setSize(size) {
        this._size = size;
        this._mergeToRedis();
    }

    /**
     *
     * @param {string} pass
     */
    setPass(pass) {
        this._pass = pass;
        this._mergeToRedis();
    }

    /**
     * Broadcast message to this channel, if except is defined this client don't receive the message
     * @param {string} message
     * @param {Client} except
     */
    broadcast(message, except) {
        this.users.forEach((u) => {
            if (u !== except)
                u.socket.send(message);
        });
    }

    /**
     *
     * @param {Socket} socket
     * @param {Client} guest
     */
    invite(socket, guest) {
        if (this._invitations.indexOf(guest.identity) === -1) {
            this._invitations.push(guest.identity);
            RPLSender.RPL_SERVER_ACCEPT_THE_INVITATION(socket, guest, this);
            RPLSender.RPL_YOU_HAVE_BEEN_INVITED(socket, guest, this);
            this._mergeToRedis();
        }
    }

    /**
     *
     * @param {Client} userBanned
     * @param {number} banishmentTime
     */
    ban(userBanned, banishmentTime) {
        let banDuration = parseInt(banishmentTime) * 1000;//millisecond
        let endTimeOfBan = Date.now() + banDuration;
        this._bannedIP[userBanned.socket.ip] = endTimeOfBan;
        this._mergeToRedis();
        RPLSender.RPL_CHANNELMODEIS(this, this.name + " +b " + userBanned.name + " " + banishmentTime);
        this.removeUser(userBanned);
    }

    /**
     *
     * @param {Client} userBanned
     */
    unban(userBanned) {
        if (this._bannedIP[userBanned.socket.ip]) {
            RPLSender.RPL_CHANNELMODEIS(this, this.name + " -b " + userBanned.name);
            this._mergeToRedis();
            delete this._bannedIP[userBanned.socket.ip];
        }
    }

    /**
     *
     * @param {Client} user
     * @returns {boolean}
     * @private
     */
    _isBan(user) {
        if (this._bannedIP[user.socket.ip] > Date.now()) {
            return true;
        } else {
            delete this._bannedIP[user.socket.ip];
            return false;
        }
    }

    /**
     *return flags only from registered users
     * @returns {{}} registeredUsersFlags
     */
    getOnlyRegisteredUsersFlags() {
        let registeredUsersFlags = {};
        for (let key in this._usersFlags) {
            if (this._usersFlags.hasOwnProperty(key)) {
                let user = Client.getClient(key);
                //if someone connected match with in usersFlags
                if (user && user.isRegisteredWithPass()) {
                    registeredUsersFlags[key] = this._usersFlags[key];
                }
                //keep flags load in DB
                else if (!user) {
                    registeredUsersFlags[key] = this._usersFlags[key];
                }
            }
        }
        return registeredUsersFlags;
    }

    /**
     *
     * @returns {Channel}
     */
    static getChannelByName(nameChannel) {
        for (let i = 0; i < Channel.list().length; i++) {
            if (Channel.list()[i].name === nameChannel) {
                return Channel.list()[i];
            }
        }
        return null;
    }

    toString() {
        return this.name;
    }

    /**
     *
     * @returns {Array<Channel>}
     */
    static list() {
        return channels;
    }

    /**
     *
     * @param {Array<Channel>} chans
     */
    static updateList(chans) {
        chans.map((c) => {
            let chan =
                new Channel(
                    {identity: c._creator},
                    c._name,
                    c._pass,
                    c._size,
                    c._topic
                );
            chan.flags = c._flags;
            chan._usersFlags = c._usersFlags;
            chan._files = c._files;
        });
    }
}

export default Channel;