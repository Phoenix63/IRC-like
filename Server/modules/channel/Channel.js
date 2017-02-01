
var shortid     = require('shortid');
var err         = require('./../ErrorManager');

var channels = [];

var Channel = (function() {

    function Channel(creator, name, pass, maxSize) {
        if(!typeof maxSize === "number") {
            err.ERR_INVALIDCHANNELNAME(creator);
            delete this;
            return;
        }
        this.flags = '';
        this.id = shortid.generate();
        this.creator = creator;
        this.pass = pass;
        this.maxSize = maxSize;



        this.invisibleUsers = [];
        this.notifiedUsers = [];
        this.operators = [];

        this.bannedUsers = [];
        this.users = [];

        this.invitation = [];

        this.operators.push(creator);
        this.users.push(creator);
        this.notifiedUsers.push(creator);


        this.name = '';
        this.setName(creator, name);

        if(this.name === '') {
            delete this;
            return;
        }

        channels.push(this);

        this.broadcast(':'+creator.name+' JOIN '+this.name);

    }

    Channel.prototype.setName = function(op, name) {
        if(this.operators.indexOf(op)<0) {
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
            console.log('error');
            err.ERR_INVALIDCHANNELNAME(op.socket);
            return;
        }
        this.name = name;
    }

    Channel.prototype.addUser = function(user, key) {
        if(this.bannedUsers.indexOf(user)>=0) {
            err.ERR_BANNEDFROMCHAN(user.socket);
            return;
        }
        if(this.flags.indexOf('i')>=0 && this.invitation.indexOf(user) === -1) {
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
        this.users.push(user);
        this.notifiedUsers.push(user);

        this.broadcast(':'+user.name+' JOIN '+this.name);
    }

    Channel.prototype.removeUser = function(user) {
        this.users.splice(this.users.indexOf(user), 1);
        this.invisibleUsers.splice(this.invisibleUsers.indexOf(user), 1);
        this.notifiedUsers.splice(this.notifiedUsers.indexOf(user), 1);

        this.operators.splice(this.notifiedUsers.indexOf(user), 1);
        if(user === this.creator) {
            this.creator = this.operators[0];
        }
        this.broadcast(':'+user.name+' PART '+this.name);
        user.channels.splice(user.channels.indexOf(this),1);
    }

    Channel.prototype.broadcast = function(message) {
        this.users.forEach(function(u) {
            u.socket.send(message);
        });
    }

    Channel.list = function() {
        return channels;
    }

    return Channel;
})();

module.exports = Channel;