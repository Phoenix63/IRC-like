"use strict";

import Channel from './../channel/Channel';
import Client from './../client/client';
import ERRSender from './../responses/ERRSender';
import RPLSender from './../responses/RPLSender';

module.exports = function (socket, command) {
    if (!socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'MODE');
        return;
    }
    let awayRegex = /^:([ a-zA-Z0-9_-é"'ëäïöüâêîôûç`è]{1,50})$/.exec(command[1]);

    if(awayRegex){
        let messageAway = awayRegex[1];
        socket.client.away = messageAway;
        RPLSender.RPL_NOWAWAY(socket);

    }else {
        socket.client.away = false;
        RPLSender.RPL_UNAWAY(socket);
    }
};
