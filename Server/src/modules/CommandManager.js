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
    'TOPIC': require('./command/TOPIC')
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
        let command = line.match(/^[A-Z]+([ ][^[a-zA-Z0-9#&:][a-zA-Z0-9 ]+)?/g);
        if (command) {
            return [command[0], line.replace(new RegExp(command[0] + "[ ]?"), '')];
        } else {
            return [line.split(' ')[0], null];
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