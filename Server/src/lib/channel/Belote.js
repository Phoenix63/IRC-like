import Channel from './Channel';
import ERRSender from './../responses/ERRSender';
import RPLSender from './../responses/RPLSender';
import config from './../../config.json';
import Game from './lib/Game';

let belotes = [];

class Belote extends Channel {
    constructor(creator, name) {
        super(creator, name, '', 4, '');
        this._persistent = false;

        this._addChannelFlag('ptin');

        this.game = new Game(this);

        belotes.push(this);

    }

    addUser(user, key = '') {
        if (this.isInvitation && this._invitations.indexOf(user.identity) === -1 && user.identity !== this.creator) {
            ERRSender.ERR_INVITEONLYCHAN(user, this);
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

            this._flags.split('').forEach((flag) => {
                RPLSender.RPL_CHANNELMODEIS(this, this._name + ' +' + flag);
            });

            this.game.addUser(user);
        }
    }

    removeUser(user, message = 'Gone', bool) {
        let index = this._users.indexOf(user);
        if (index < 0) {
            ERRSender.ERR_NOTONCHANNEL(user, this);
        } else {
            this._users.splice(index, 1);
            RPLSender.PART(user, this, message);

            user.removeChannel(this);

            belotes.splice(belotes.indexOf(this), 1);

            this.game.removeUser(user);
        }

    }

    invite(socket, guest) {
        if (this._invitations.indexOf(guest.identity) === -1) {
            this._invitations.push(guest.identity);
            socket.send(':' + config.ip + ' 341 ' + guest.name + ' ' + this.name);
            guest.socket.send(':' + config.ip + ' 642 ' + socket.client.name + ' ' + this.name);
        }
    }

    static list() {
        return belotes;
    }
}

export default Belote