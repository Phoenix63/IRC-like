
import Client from './../client/client';
import Channel from './../channel/Channel';

import config from './../../config.json';

class RPLSender {

    constructor() {

    }
    /**
     * reply rpl_namreply to the client
     * @param {Client} client
     * @param {Channel} channel
     * @static
     */
    static RPL_NAMREPLY(client, channel) {
        let sep = '=';
        if(channel.isSecret)
            sep = '@';
        if(channel.isPrivate)
            sep = '*';

        let ret = ':'+config.ip+' 353 '+ client.name +' '+sep+' '+channel.name;
        let us = '';
        channel.users.forEach((u) => {
            var delimiter = '';
            if(channel.usersFlags[u.id].flags.indexOf('o')>=0) {
                delimiter = '@';
            } else if (this.usersFlags[u.id].flags.indexOf('v')>=0) {
                delimiter = '+';
            }
            us += ' '+delimiter+channel.usersFlags[u.id].client.name;

        });

        if(us) {
            client.socket.send(ret+(us?' :'+us.slice(1,us.length):''));
        }
        client.socket.send(':'+config.ip+' 366 '+ client.name +' :End of /NAMES list');
    }

    /**
     * reply RPL_WHOREPLY to the client
     * @param {Client} client
     * @param {Channel} channel
     * @static
     */
    static RPL_WHOREPLY(client, channel) {
        channel.users.forEach((u) => {
            var delimiter = '';
            if(channel.usersFlags[u.id].flags.indexOf('o')>=0) {
                delimiter = '@';
            } else if (channel.usersFlags[u.id].flags.indexOf('v')>=0) {
                delimiter = '+';
            }
            client.socket.send(
                ':'+config.ip+' 352 '+client.name+' '+channel.name+' ~'
                +u.identity+' '+u.ip+' '+config.ip+' '+u.name+ ' '
                +(u.away?'G':'H')
                + delimiter + ' :0 '+u.realname);

        });
        client.socket.send(':'+config.ip+' 315 '+client.name+' '+this.name+' :End of /WHO list');
    }

    /**
     *
     * @param {Client} client
     * @param {Channel} channel
     * @static
     */
    static RPL_TOPIC(client, channel) {
        if(channel.topic) {
            client.socket.send(':'+config.ip+' 332 JOIN '+channel.name+' :'+channel.topic);
        } else {
            client.socket.send(':'+config.ip+' 331 JOIN '+channel.name+' :No topic is set');
        }
    }

    /**
     *
     * @param {Client} client
     * @param {Channel} channel
     * @static
     */
    static JOIN(client, channel) {
        channel.broadcast(':'+client.name+' JOIN '+channel.name);
    }

    /**
     *
     * @param {Client} client
     * @param {Channel} channel
     * @static
     */
    static PART(client, channel) {
        channel.broadcast(':'+client.name+' PART '+channel.name);
    }

    /**
     *
     * @param {Client} client
     * @param {Array<string>} list
     * @constructor
     */
    static LIST(client, list) {
        let channels = list.split(' ')[0].split(',');

        client.socket.send(":"+config.ip+" 321 Channel :Users Name");
        Channel.list().forEach((chan) => {
            if(((channels[0] !== '' && channels.indexOf(chan)>=0) || channels[0] === '')&& (!chan.isSecret || (chan.isSecret && chan.users.indexOf(client)>=0))) {
                socket.send(":"+config.ip+" 322 "+client.name+" "+(chan.isPrivate?'#':'')+chan.name+' '+chan.users.length+' :'+(chan.topic || 'No topic set'));
            }
        });
        client.socket.send(":"+config.ip+" 323 "+client.name+" :End of /LIST");
    }
}

module.exports = RPLSender;