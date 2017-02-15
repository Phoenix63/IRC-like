/**
 * Created by titir on 10/02/2017.
 */
 /* <server.ip> 311 <user.nick> <user.identity> <server.ip> * :<user.realname> */
import ERRSender from './../responses/ERRSender';
import config from './../../config.json';

module.exports = function(socket,command) {
    if (! socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, "WHOIS");
        return;
    }

    socket.send("crismos.fr"+" "+"311"+" "+socket.client.name+" "+socket.client.identity+" "+config.ip+" :"+socket.client.realname);
}