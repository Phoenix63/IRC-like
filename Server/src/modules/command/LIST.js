"use strict";

import Channel from './../channel/Channel';
import config from './../../config.json';

module.exports = function(socket, command) {

    if(!socket.client.identity) {
        socket.send(':'+config.ip+' 451 * LIST :You have not registered');
        return;
    }

    let channels = command[1].split(' ')[0].split(',');

    socket.send(":"+config.ip+" 321 Channel :Users Name");
    Channel.list().forEach((chan) => {
        if(((channels[0] !== '' && channels.indexOf(chan)>=0) || channels[0] === '')&& (!chan._isSecret || (chan._isSecret && chan.users.indexOf(socket.client)>=0))) {
            socket.send(":"+config.ip+" 322 "+socket.client.name+" "+(chan._isPrivate?'#':'')+chan.name+' '+chan.users.length+' :'+(chan.topic || 'No topic set'));
        }
    });
    socket.send(":"+config.ip+" 323 "+socket.client.name+" :End of /LIST");
}