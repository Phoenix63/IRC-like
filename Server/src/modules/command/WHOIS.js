/**
 * Created by titir on 10/02/2017.
 */

import ERRSender from './../responses/ERRSender';

module.exports = function(socket,command) {
    if (! socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, "WHOIS");
        return;
    }
    socket.send(command[1]);
}