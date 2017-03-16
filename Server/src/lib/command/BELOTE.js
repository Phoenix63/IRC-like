"use strict";

import Belote from './../channel/Belote';
import ERRSender from './../responses/ERRSender';

module.exports = function (socket, command) {
    if (!socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'JOIN');
    } else {

        let allowed = {
            'JOIN': function(arg) {
                let name = arg[1];
                if (!name.match(/\W/g) || name.match(/\W/g).join('') !== '&' || name[0] !== '&' || name.length <= 1) {
                    ERRSender.ERR_NOSUCHCHANNEL(socket.client, name);
                } else {
                    let err = true;
                    Belote.list().forEach((belote) => {
                         err = false;
                         belote.addUser(socket.client);
                    });
                    if (err) {
                        let bel = new Belote(socket.client, name);
                        bel.addUser(socket.client);
                    }
                }
            }
        }


        let cmd = command[1].split(' ');
        let commande = cmd[0];
        if(!allowed[commande]) {
            ERRSender.ERR_UNKNOWNCOMMAND(socket.client, command[0]+' '+commande);
            return;
        }
        allowed[commande](cmd);
    }
};