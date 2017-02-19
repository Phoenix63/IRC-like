"use strict";

import Channel from './../channel/Channel';
import Client from './../client/client';
import ERRSender from './../responses/ERRSender';
import RPLSender from './../responses/RPLSender';

module.exports = function (socket, command) {
    let resultRegex = /^#([a-zA-Z0-9_-é"'ëäïöüâêîôûç`è]{1,15}) ([+|-])([opsitnmlbvk]{1,11}) (?:([0-9]{1,3})$|([a-zA-Z0-9_-é"'ëäïöüâêîôûç`è]{1,15})$)/.exec(command[1]);

    if(!resultRegex){
        ERRSender.ERR_UNKNOWNCOMMAND(socket.client, command[0]);
        return;
    }else{
        let nameChannel = resultRegex[1];
        let operator = resultRegex[2];
        let flags = resultRegex[3];
        let limit = resultRegex[4];
        //arg5 can be nickame or keyword to securize a channel
        let arg5 = resultRegex[5];

        let channel = Channel.getChannelByName(nameChannel);
        let client;
        if(!channel){
            ERRSender.ERR_NOSUCHCHANNEL(socket.client, command[0]);
            return;
        }

        if(arg5 && flags.indexOf('k') === -1){
            client = Client.find(arg5);
            if(!client){
                ERRSender.ERR_UNKNOWNCOMMAND(socket.client, command[0]);
                return;
            }
            //give/take channel operator privileges;
            if(flags.indexOf('o') > -1){
                channel.changeClientFlag(operator,'o',client);
            }
            //give/take the ability to speak on a moderated channel;
            if(flags.indexOf('v') > -1){
                channel.changeClientFlag(operator,'v',client);
            }
        }else if(arg5 && flags.indexOf('k') > -1){
            //set a channel key (password).
            channel.setPass(arg5);
        }
        if(flags.indexOf('l') > -1 && operator === "+" && limit){
            //set the user limit to channel;
            if(limit>1){
                channel.setSize(limit);
            }
        }
        if(flags.indexOf('p') > -1){
            //private channel flag;
            channel.changeChannelFlag(operator,'p')
        }
        if(flags.indexOf('s') > -1){
            //secret channel flag;
            channel.changeChannelFlag(operator,'s')
        }
        if(flags.indexOf('i') > -1){
            //invite-only channel flag;
            channel.changeChannelFlag(operator,'i')
        }
        if(flags.indexOf('t') > -1){
            //topic settable by channel operator only flag;
            channel.changeChannelFlag(operator,'t')
        }
        if(flags.indexOf('n') > -1){
            //no messages to channel from clients on the outside;
            channel.changeChannelFlag(operator,'n')
        }
        console.log(nameChannel);
        console.log(operator);
        console.log(flags);
        console.log(limit);
        console.log(arg5);
    }

};
