"use strict";

import ERRSender from './../responses/ERRSender';

/**
 *
 * @param {Socket} socket
 * @param command
 */
module.exports = function (socket, command) {
    if (socket.client) {
        socket.client.delete();
    } else {
        socket.close();
    }

}