"use strict";

/**
 *
 * @param {Socket} socket
 * @param command
 */
module.exports = function (socket, command) {
    socket._socket.destroy();
};