"use strict";

import Client from './../client/client';
import ERRSender from './../responses/ERRSender';
import RPLSender from './../responses/RPLSender';
import Redis from './../data/RedisInterface';
let redis = Redis.instance;

let channels = [];


class Channel {

    /**
     *
     * @param {Client} creator
     * @param {string} name
     * @param {string} pass
     * @param {number} size
     * @param {string} topic
     * @constructor
     */
    constructor(creator, name, pass, size, topic='') {
         /**
         s 		canal secret; le canal est totalement invisible
         p 		canal privé; le nom du canal est invisible
         n 		les messages externes ne sont pas autorisés
         m 		canal modéré, seuls les utilisateurs en mode +v et les opérateurs peuvent envoyer un message
         i 		canal accessible uniquement sur invitation (commande /invite)
         t 		sujet du canal uniquement modifiable par les opérateurs du canal
         */
        this._flags = '';

        this._pass = pass || '';
        this._size = size;
        this._bannedUsers = [];
        this._users = [];

        this._creator = creator.identity;
        /**
         o 	@ 	nom de l'utilisateur concerné 	Opérateur de canal : peut changer les modes du channel et expulser les autres utilisateurs
         v 	+ 	nom de l'utilisateur concerné 	verbose ou voiced : autorise l'utilisateur à parler sur un canal modéré (mode +m)
         */
        this._usersFlags = {};
        this._invitation = [];
        this._name = name;
        this._temporary = true;
        this._topic = topic;


        // not loaded from db
        if(creator instanceof Client) {
            //isUser ??????
            if(creator.isAdmin()) {
                this.setPersistent(true);
            }

            this.addUser(creator, pass);
        } else {
            this.setPersistent(true);
        }

        this._addChannelFlag('tn');
        channels.push(this);
    }

    _change() {
        if(!this._temporary) {
            redis.upsertChannel(this);
        }
    }

    /**
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }



    get topic() {
        if(this._topic !== '') {
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
     * @param id|nickname|client
     * @returns {null|Client}
     */
    getUser(id) {
        for (let key in this._users) {
            if (key === id || this._users[key].name === id || this._users[key].id === id) {
                return this._users[key];
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
     *
     * @returns {Client}
     */
    get creator() {
        return this._creator;
    }

    /**
     * set channel persistent or not
     * @param {Boolean} bool
     */
    setPersistent(bool) {
        this._temporary = !bool;
        if(bool) {
            redis.upsertChannel(this);
        } else {
            redis.deleteChannel(this);
        }
    }


    /**
     *
     * @param client
     * @param flags
     * @private
     */
    _addClientFlag(client, flags) {
        let arrayFlags = flags.split('');
        arrayFlags.forEach((flag) => {
            if (this._usersFlags[client.identity].indexOf(flag) === -1) {
                this._usersFlags[client.identity] += flag;
                RPLSender.RPL_CHANNELMODEIS(this,this._name+' +'+flag+' '+client.name);
            }
        });
        this._change();
    }

    /**
     *
     * @param client
     * @param flags
     * @private
     */
    _removeClientFlag(client, flags) {
        let arrayFlags = flags.split('');
        arrayFlags.forEach((flag) => {
            let tmp = this._usersFlags[client.identity].length;
            this._usersFlags[client.identity] = this._usersFlags[client.identity].replace(flag, '');
            if(tmp-1 === this._usersFlags[client.identity].length){
                RPLSender.RPL_CHANNELMODEIS(this,this._name+' -'+flag+' '+client.name);
            }
        });
        this._change();
    }

    /**
     *
     * @param {String} flags
     */
    _addChannelFlag(flags) {
        let arrayFlags = flags.split('');
        arrayFlags.forEach((flag) => {
            if(this._flags.indexOf(flag)===-1){
                this._flags += flag;
                RPLSender.RPL_CHANNELMODEIS(this,this._name+' +'+flag);
            }
        });
        this._change();
    }
    /**
     *
     * @param {String} flags
     */
    _removeChannelFlag(flags) {
        let arrayFlags = flags.split('');
        arrayFlags.forEach((flag) => {
            let tmp = this._flags.length;
            this._flags = this._flags.replace(flag,'');
            if(tmp-1 === this._flags.length){
                RPLSender.RPL_CHANNELMODEIS(this,this._name+' -'+flag);
            }
        });
        this._change();
    }

    /**
     *
     * @param operator
     * @param flag
     * @param client
     */
    changeClientFlag(operator, flag, client) {
        if(operator==='+') {
            this._addClientFlag(client, flag);
        }else {
            this._removeClientFlag(client, flag);
        }
    }

    /**
     *
     * @param operator
     * @param flag
     */
    changeChannelFlag(operator, flag) {
        if(operator==='+') {
            this._addChannelFlag(flag);
        }else {
            this._removeChannelFlag(flag);
        }
    }


    /**
     * return true if the clinet is operator
     * @param {Client} client
     * @returns {boolean}
     */
    isUserOperator(client) {
        if (this._usersFlags[client.identity] && this._usersFlags[client.identity].indexOf('o') >= 0) {
            return true;
        } else if(this._temporary && client.identity === this._creator) {
            return true;
        }
        return false;
    }

    /**
     * return true if the client is voice
     * @param {Client} client
     * @returns {boolean}
     */
    isUserVoice(client) {
        if (this._usersFlags[client.identity] && this._usersFlags[client.identity].indexOf('v') >= 0)
            return true;
        return false;
    }


    setUserFlags(flags) {
        this._usersFlags = flags;
        this._change();
    }



    /**
     * add user to the channel
     * @param {Client} user
     * @param {string} key
     */
    addUser(user, key='') {
        if (this._bannedUsers.indexOf(user) >= 0) {
            ERRSender.ERR_BANNEDFROMCHAN(user, this);
            return;
        }
        if (this.isInvitation && this.isInvitation.indexOf(user) === -1) {
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
        if(this._users.indexOf(user) < 0) {
            this._users.push(user);
            //if(user.isUser()) {

                if(!this._usersFlags[user.identity]) {
                    this._usersFlags[user.identity] = '';
                }

                if (this._users.length === 1 && this._temporary) {
                    console.log("yep1");
                    this._addClientFlag(user,'o')
                }

                if (this._pass.length>0){
                    this._addChannelFlag('p');
                }

                if(user.isAdmin() || user.isSuperAdmin() || user.identity === this._creator) {
                    console.log("yep2");
                    console.log("=>"+user.isAdmin() );
                    console.log("=>"+user.isSuperAdmin());
                    console.log("=>"+(user.identity === this._creator));
                    this._addClientFlag(user,'o')
                }
            //}
            this._change();
            user.addChannel(this);
            RPLSender.JOIN(user, this);
            RPLSender.RPL_TOPIC('JOIN', user, this);
            RPLSender.RPL_NAMREPLY(user, this);
        }
    }

    /**
     * remove user from this channel
     * @param {Client} user
     * @param {string} message
     */
    removeUser(user, message='Gone') {
        let index = this._users.indexOf(user);
        if (index < 0) {
            ERRSender.ERR_NOTONCHANNEL(user, this);
        } else {
            this._users.splice(index, 1);
            RPLSender.PART(user, this, message);
            user.removeChannel(this);

            if(this._temporary && this._users.length <= 0) {
                channels.splice(channels.indexOf(this), 1);
            }
        }

    }
    setSize(size) {
        this._size = size;
    }
    setPass(pass) {
        this._pass = pass;
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
     * @returns {Array<Channel>}
     */
    static getChannelByName(nameChannel){
        for(let i = 0; i< Channel.list().length;i++){
            if(Channel.list()[i].name===nameChannel){
                return Channel.list()[i];
            }
        }
        return null;
    }

    static list() {
        return channels;
    }

}

export default Channel;