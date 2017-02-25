"use strict";

import Channel from './../channel/Channel';
import Client from './../client/client';
import ERRSender from './../responses/ERRSender';
import RPLSender from './../responses/RPLSender';

module.exports = function (socket, command) {
    let channelModeRegex = /^(#[a-zA-Z0-9_-é"'ëäïöüâêîôûç`è]{1,15}) ([+|-])([opsitnmlbvk]{1,11}) (?:([0-9]{1,3})$|([a-zA-Z0-9_-é"'ëäïöüâêîôûç`è]{1,15})$)/.exec(command[1]);
    let userModeRegex = /^([a-zA-Z0-9_-é"'ëäïöüâêîôûç`è]{1,15}) ([+|-])([iswo]{1,11})$/.exec(command[1]);

    if(channelModeRegex){
        let nameChannel = channelModeRegex[1];
        let sign = channelModeRegex[2];
        let flags = channelModeRegex[3];
        let limit = channelModeRegex[4];
        //arg5 can be nickame or keyword to securize a channel
        let arg5 = channelModeRegex[5];
        let channel = Channel.getChannelByName(nameChannel);
        console.log("+++"+channel);
        let user;
        let operator;

        if(!channel){
            ERRSender.ERR_NOSUCHCHANNEL(socket.client, command[0]);
            return;
        }
        operator = channel.getUser(socket.client.id);
        if(!operator){
            ERRSender.ERR_NOTONCHANNEL(socket.client,command[0]);
            return;
        }
        if (!channel.isUserOperator(operator)){
            ERRSender.ERR_CHANOPRIVSNEEDED(socket.client, command[0]);
            return;
        }
        if(arg5 && flags.indexOf('k') === -1){
            user = channel.getUser(arg5);
            if(!user){
                ERRSender.ERR_USERNOTINCHANNEL(socket.client,command[0]);
                return;
            }
            //operator can't change their flag each other
            if(channel.isUserOperator(user)){
                ERRSender.ERR_USERSDONTMATCH(socket.client,command[0]);
                return;
            }
            //give/take channel operator privileges;
            if(flags.indexOf('o') > -1){
                channel.changeClientFlag(sign,'o',user);
            }
            //give/take the ability to speak on a moderated channel;
            if(flags.indexOf('v') > -1){
                channel.changeClientFlag(sign,'v',user);
            }
        }else if(arg5 && flags.indexOf('k') > -1){
            //set a channel key (password).
            if(sign==='-'){
                channel.setPass('');
            }else{
                if(!channel.pass === ''){
                    ERRSender.ERR_KEYSET(socket.client,command[0]);
                }else{
                    channel.setPass(arg5);
                }
            }
        }
        if(flags.indexOf('l') > -1 && sign === "+" && limit){
            //set the user limit to channel;
            if(limit>1){
                channel.setSize(limit);
            }
        }
        if(flags.indexOf('p') > -1){
            //private channel flag;
            channel.changeChannelFlag(sign,'p')
        }
        if(flags.indexOf('s') > -1){
            //secret channel flag;
            channel.changeChannelFlag(sign,'s')
        }
        if(flags.indexOf('i') > -1){
            //invite-only channel flag;
            channel.changeChannelFlag(sign,'i')
        }
        if(flags.indexOf('t') > -1){
            //topic settable by channel operator only flag;
            channel.changeChannelFlag(sign,'t')
        }
        if(flags.indexOf('n') > -1){
            //no messages to channel from clients on the outside;
            channel.changeChannelFlag(sign,'n')
        }
    }else if(userModeRegex){
        let user = userModeRegex[1];
        let sign = userModeRegex[2];
        let flags = userModeRegex[3];


    }else {
        ERRSender.ERR_UMODEUNKNOWNFLAG(socket.client, command[0]);
    }


};
