"use strict";

import ERRSender from './../responses/ERRSender';
import cluster from 'cluster';

module.exports = function (socket, command) {

    /*if (!socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'WHO');
        return;
    }

    if (!socket.client.isAdmin()) {
        ERRSender.ERR_NOPRIVILEGES(socket.client);
        return;
    }*/

    //cluster.worker.send({quitmessage: 'quit'});
};