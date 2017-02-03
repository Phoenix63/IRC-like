
var shortid     = require('shortid');
var err         = require('./../SignalManager');
var config      = require('./../../config.json');

var channels = [];

var Channel = (function() {

    function Channel(creator, name, pass, maxSize) {
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

    Channel.prototype.__defineGetter__('users', function() {
        var list = [];
        for(var key in this.usersFlags) {
            list.push(this.usersFlags[key].client);
        }
        return list;
    });

    Channel.prototype.RPL_NAMREPLY = function(socket) {
        var sep = '=';
        if(this._isSecret)
            sep = '@';
        if(this._isPrivate)
            sep = '*';

        var ret = ':'+config.ip+' 353 '+ socket.client.name +' '+sep+' '+this.name;
        var us = '';
        this.users.forEach((function(u) {
            var delimiter = '';
            if(this.usersFlags[u.id].flags.indexOf('o')>=0) {
                delimiter = '@';
            } else if (this.usersFlags[u.id].flags.indexOf('v')>=0) {
                delimiter = '+';
            }
            us += ' '+delimiter+this.usersFlags[u.id].client.name;

        }).bind(this));

        if(us)
            socket.send(ret+(us?' :'+us.slice(1,us.length):''));
        socket.send(':'+config.ip+' 366 '+ socket.client.name +' :End of /NAMES list');
    }

    Channel.prototype.setName = function(op, name) {


        if(!this.usersFlags[op.id] || this.usersFlags[op.id].flags<0) {
            err.ERR_NOTOPONCHANNEL(op.socket);
            return;
        }

        if(name[0] !== '#') {
            name = '#'+name;
        }
        var error = false;
        channels.forEach(function(chan) {
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

    Channel.prototype.addUser = function(user, key) {
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

    Channel.prototype.removeUser = function(user) {

        if(this.users.indexOf(user)<0) {
            err.ERR_NOTONCHANNEL(user.socket);
            return;
        }


        if(user === this.creator) {
            this.users.forEach((function(u) {
                if(this.usersFlags[u].flags.indexOf('o')>=0) {
                    this.creator = u;
                }
            }).bind(this));
            this.creator = this.operators[0];
        }

        this.broadcast(':'+user.name+' PART '+this.name);
        user.channels.splice(user.channels.indexOf(this),1);

        delete this.usersFlags[user];
        if(this.users.length <= 0) {
            channels.splice(channels.indexOf(this), 1);
            delete this;
        }
    }

    Channel.prototype.broadcast = function(message, except) {
        this.users.forEach(function(u) {
            if(u !== except)
                u.socket.send(message);
        });
    }

    Channel.prototype.RPL_WHOREPLY = function(socket) {
        this.users.forEach((function(u) {
            var delimiter = '';
            if(this.usersFlags[u.id].flags.indexOf('o')>=0) {
                delimiter = '@';
            } else if (this.usersFlags[u.id].flags.indexOf('v')>=0) {
                delimiter = '+';
            }
            socket.send(
                ':'+config.ip+' 352 '+socket.client.name+' '+this.name+' ~'
                +u.name+' '+u.ip+' '+config.ip+' '+u.name+ ' '
                +(u.away?'G':'H')
                + delimiter + ' :0 Guest_'+u.id);


        }).bind(this));
        socket.send(':'+config.ip+' 315 '+socket.client.name+' '+this.name+' :End of /WHO list');

    }




    Channel.prototype.__defineGetter__('_isPrivate', function() {
        return (this.flags.indexOf('p')>=0);
    });
    Channel.prototype.__defineGetter__('_isSecret', function() {
        return (this.flags.indexOf('s')>=0);
    });
    Channel.prototype.__defineGetter__('_isInvitation', function() {
        return (this.flags.indexOf('i')>=0);
    });

    Channel.list = function() {
        return channels;
    }

    return Channel;
})();

module.exports = Channel;