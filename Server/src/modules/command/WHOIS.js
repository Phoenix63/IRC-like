/**
 * Created by titir on 10/02/2017.
 */
 /* <server.ip> 311 <user.nick> <user.identity> <server.ip> * :<user.realname> */
import ERRSender from './../responses/ERRSender';
import RPLSender from './../responses/RPLSender';
import Client from '../client/Client';

module.exports = function(socket,command) {
    let whoisRegex = /^([a-zA-Z0-9_-é"'ëäïöüâêîôûç`è]{1,15})$/.exec(command[1]);
    if (! socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'WHOIS');
        return;
    }
    if(whoisRegex){
        let user = Client.getClient(whoisRegex[1]);
        if (user) {
            RPLSender.RPL_WHOISUSER(socket.client, user);
        } else{
            ERRSender.ERR_NONICKNAMEGIVEN(socket.client);
            return;
        }
    }else {
        ERRSender.ERR_NONICKNAMEGIVEN(socket.client);
        return;
    }
};