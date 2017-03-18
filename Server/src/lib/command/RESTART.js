"use strict";

import ERRSender from './../responses/ERRSender';
import cluster from 'cluster';

module.exports = function (socket, command) {

    if (!socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'RESTART');
        return null;
    }

    if (!socket.client.isAdmin()) {
        ERRSender.ERR_NOPRIVILEGES(socket.client);
        return null;
    }

    cluster.worker.send({quitmessage: 'restart'});

};