"use strict";

import ERRSender from './../responses/ERRSender';

module.exports = function (socket, command) {

    if (socket.client.isRegistered && !socket.client.isRegisteredWithPass()) {
        ERRSender.ERR_ALREADYREGISTRED(socket.client);
        return;
    }


    let cmd = command[1].split(' ');
    let pass = cmd[0];

    if (!pass) {
        ERRSender.ERR_NEEDMOREPARAMS(socket.client, 'PASS');
        return;
    }

    socket.client.pass = pass;

};
