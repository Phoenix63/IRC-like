"use strict";

import ERRSender from './responses/ERRSender';


let allowedCommand = {
    'NICK': require('./command/NICK'),
    'JOIN': require('./command/JOIN'),
    'PART': require('./command/PART'),
    'PRIVMSG': require('./command/PRIVMSG'),
    'NAMES': require('./command/NAMES'),
    'LIST': require('./command/LIST'),
    'QUIT': require('./command/QUIT'),
    'WHO': require('./command/WHO'),
    'USER': require('./command/USER'),
    'PASS': require('./command/PASS'),
    'PONG': function(){},
    'WHOIS': require('./command/WHOIS'),
    'MODE':require('./command/MODE'),
    'TOPIC': require('./command/TOPIC'),
    'RESTART': require('./command/RESTART'),
    'KICK': require('./command/KICK'),
    'INVITE': require('./command/INVITE'),
    'AWAY': require('./command/AWAY'),
    'LISTFILES': require('./command/LISTFILES'),
    'RMFILE': require('./command/RMFILE')
};

class CommandManager {
    /**
     * read message sended by client
     * @param {Socket} socket
     */
    constructor(socket) {
        this.socket = socket;
        this.socket.on('message', (str) => {
            this.socket.logger._USER_SEND_CMD(str);
            this.exec(CommandManager.parseMessage(str));
        });
    }

    /**
     *
     * @param {string} line
     * @returns {[string,*]}
     */
    static parseMessage(line) {
        //let command = line.match(/^[A-Z]+(.+)?/g);
        let command = /(^[A-Z]+)(.*)?/.exec(line);
        if (command && command[1]) {
            if(!command[2]) {
                command[2] = '';
            }
            if(command[2] && command[2][0] === ' ') {
                command[2] = command[2].slice(1,command[2].length);
            }
            return [command[1], command[2]];
        } else {
            return [line, null];
        }
    }

    /**
     * exec a command if it's allowed
     * @param {Array} command
     */
    exec(command) {
        if (allowedCommand[command[0]]) {
            allowedCommand[command[0]](this.socket, command);
        } else {
            ERRSender.ERR_UNKNOWNCOMMAND(this.socket.client, command[0] || 'undefined');
        }

    }
}
export default CommandManager