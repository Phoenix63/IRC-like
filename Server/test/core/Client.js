var net = require('net');

var Client = (function() {
    function Client(port, ip) {
        this.id = Math.floor(Math.random()*10000);
        this._config = {
            port: port,
            ip: ip
        };
        this._callbacks = {};
        this._socket = new net.Socket();
        this._socket.connect(port, ip, () => {
            this._socket.buffer = '';
            this._socket.on('data', (data) => {
                var lines = data.toString().split(/\n|\r/),
                    i, line;

                for (i = 0; i < lines.length - 1; i += 1) {
                    line = this._socket.buffer + lines[i];
                    this._socket.buffer = '';

                    this._socket.emit('message', line);
                    this._socket.receiving = false;
                }

                this._socket.buffer += lines[lines.length - 1];
            });

            this._socket.on('message', (message) => {
                if(message.trim() === '') {
                    return null;
                }
                this.parse(message);
            });
        });
    }

    Client.prototype.parse = function(message) {
        //console.log(message);
        if(message.indexOf('QUIT') < 0) {

            this.emit('message', message);

            if(message === ':'+this._config.ip+' NOTICE AUTH :*** YOU ARE CONNECTED') {
                this.emit('connect', message);
            } else if (message.indexOf('372 :- Welcome') >= 0) {
                this.emit('auth', message);
            } else if (message.indexOf(' NICK ') > 0) {
                this.emit('nick', message);
            } else if (message.indexOf('JOIN #') >= 0) {
                this.emit('join', message);
            } else if (message.indexOf('Unknown command') >= 0) {
                this.emit('err_unknowncommand', message);
            } else if (message.indexOf('451') > 0) {
                this.emit('err_notregistered', message);
            } else if (message.indexOf('403') > 0) {
                this.emit('err_nosuchchannel', message);
            } else if(message.indexOf('433') > 0) {
                this.emit('err_nicknameinuse', message);
            } else if (message.indexOf('353') > 0) {
                this.emit('rpl_namreply', message);
            } else if (message.indexOf('461') > 0) {
                this.emit('err_needmoreparams', message);
            } else if (message.indexOf('412') > 0) {
                this.emit('err_notexttosend', message);
            } else if (message.indexOf('PART') > 0) {
                this.emit('part', message);
            } else if (message.indexOf('411') > 0) {
                this.emit('err_norecipient', message);
            } else if (message.indexOf('442') > 0) {
                this.emit('err_notonchannel', message);
            } else if (message.indexOf('404') > 0) {
                this.emit('err_cannotsendtochan', message);
            } else if (message.indexOf('431') > 0) {
                this.emit('err_nonicknamegiven', message);
            } else if (message.indexOf('PRIVMSG') > 0) {
                this.emit('privmsg', message);
            } else if (message.indexOf('311') > 0) {
                this.emit('rpl_whois', message);
            } else if (message.indexOf('352') > 0) {
                this.emit('rpl_who', message);
            } else if (message.indexOf('482') > 0) {
                this.emit('err_chanoprivneeded', message);
            } else if (message.indexOf('KICK') > 0) {
                this.emit('kick', message);
            }
            else if (message.indexOf('501') > 0){
                this.emit('err_unknownflag',message);
            }else if (message.indexOf('401') > 0) {
                this.emit('err_nosuchnick', message);
            }else if(message.indexOf('443') > 0) {
                this.emit('err_useronchannel',message);
            }

            /*
            else if (message.indexOf('') > 0){
                this.emit('',message);
            }
            */

        } else {
            this.emit('quit', message);
        }

    };

    Client.prototype.send = function(cmd) {
        this._socket.write(cmd+'\n');
    }

    Client.prototype.on = function(event, callback) {
        this._callbacks[event] = callback;
    }

    Client.prototype.emit = function(event, message) {
        if(this._callbacks[event]) {
            this._callbacks[event](message);
        }
    }

    Client.prototype.close = function() {
        this._socket.destroy();
    }

    return Client;
})();



module.exports = Client;