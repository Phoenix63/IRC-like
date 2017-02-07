"use strict";


import ERRSender from './../responses/ERRSender';
import RPLSender from './../responses/RPLSender';

module.exports = function(socket, command) {

    if(!socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'LIST');
        return;
    }

    RPLSender.LIST(socket.client, command[1]);


}