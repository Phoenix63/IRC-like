"use strict";

import ERRSender from './../responses/ERRSender';

/**
 *
 * @param {Socket} socket
 * @param command
 */
module.exports = function (socket, command) {
    socket._socket.destroy();
}