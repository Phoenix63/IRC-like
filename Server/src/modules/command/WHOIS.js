/**
 * Created by titir on 10/02/2017.
 */
 /* <server.ip> 311 <user.nick> <user.identity> <server.ip> * :<user.realname> */
import ERRSender from './../responses/ERRSender';
import RPLSender from './../responses/RPLSender';
import Client from './../client/client';

module.exports = function(socket,command) {
    if (! socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'WHOIS');
        return;
    }

    let user = command[1].split(' ')[0];
    if(!user) {
        ERRSender.ERR_NONICKNAMEGIVEN(socket.client);
        return;
    }

    Client.list().forEach((u) => {
        if(u.name === user) {
            RPLSender.RPL_WHOISUSER(socket.client, u);
        }
    });
}