"use strict";

import ERRSender from './../responses/ERRSender';

module.exports = function(socket, command) {

    if(!socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'QUIT');
        return;
    }

    socket.client.delete();
}