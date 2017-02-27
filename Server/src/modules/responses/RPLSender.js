import Channel from './../channel/Channel';
import Client from './../client/client';
import config from './../../config.json';

let RPLSender = {

    /**
     * reply rpl_namreply to the client
     * @param {Client} client
     * @param {Channel} channel
     * @static
     */
    RPL_NAMREPLY: (client, channel) => {
        let sep = '=';
        if (channel.isSecret)
            sep = '@';
        if (channel.isPrivate)
            sep = '*';

        let ret = ':' + config.ip + ' 353 ' + client.name + ' ' + sep + ' ' + channel.name;
        let us = '';
        channel.users.forEach((user) => {
            let delimiter = '';
            if (channel.isUserOperator(user)) {
                delimiter = '@';
            } else if (channel.isUserVoice(user)) {
                delimiter = '+';
            }
            us += ' ' + delimiter + user.name;
        });

        if (us) {
            client.socket.send(ret + (us ? ' :' + us.slice(1, us.length) : ''));
        }
        client.socket.send(':' + config.ip + ' 366 ' + client.name + ' :End of /NAMES list');
    },

    /**
     * reply RPL_WHOREPLY to the client
     * @param {Client} client
     * @param {Channel} channel
     * @static
     */
    RPL_WHOREPLY: (client, channel) => {
        channel.users.forEach((u) => {
            let delimiter = '';
            if(channel.isUserOperator(u)) {
                delimiter += '@';
            }
            else if(channel.isUserVoice(u)) {
                delimiter += '+';
            }
            client.socket.send(
                ':' + config.ip + ' 352 ' + client.name + ' ' + channel.name + ' ~'
                + u.identity + ' ' + u.ip + ' ' + config.ip + ' ' + u.name + ' '
                + (u.away ? 'G' : 'H')
                + delimiter + ' :0 ' + u.realname);

        });
        client.socket.send(':' + config.ip + ' 315 ' + client.name + ' ' + channel.name + ' :End of /WHO list');
    },

    /**
     *
     * @param {string} command
     * @param {Client} client
     * @param {Channel} channel
     * @static
     */
    RPL_TOPIC: (command, client, channel) => {
        if (channel.topic) {
            client.socket.send(':' + config.ip + ' 332 '+command+' ' + channel.name + ' :' + channel.topic);
        } else {
            client.socket.send(':' + config.ip + ' 331 '+command+' ' + channel.name + ' :No topic is set');
        }
    },

    /**
     *
     * @param {Client} client
     * @param {Channel} channel
     * @static
     */
    JOIN: (client, channel) => {
        channel.broadcast(':' + client.name + ' JOIN ' + channel.name);
    },

    /**
     *
     * @param {Client} client
     * @param {Channel} channel
     * @param {string} message
     * @static
     */
    PART: (client, channel, message='Gone') => {
        channel.broadcast(':' + client.name + ' PART ' + channel.name + ' :'+message, client);
        client.socket.send(':' + client.name + ' PART ' + channel.name + ' :'+message);
    },

    /**
     *
     * @param {Client} client
     * @param {Array<string>} list
     * @static
     */
    LIST: (client, list) => {
        let channels = list.split(' ')[0].split(',');

        client.socket.send(":" + config.ip + " 321 Channel :Users Name");
        Channel.list().forEach((chan) => {
            if (((channels[0] !== '' && channels.indexOf(chan) >= 0) || channels[0] === '') && (!chan.isSecret || (chan.isSecret && chan.users.indexOf(client) >= 0))) {
                client.socket.send(":" + config.ip + " 322 " + client.name + " " + (chan.isPrivate ? '#' : '') + chan.name + ' ' + chan.users.length + ' :' + (chan.topic || 'No topic set'));
            }
        });
        client.socket.send(":" + config.ip + " 323 " + client.name + " :End of /LIST");
    },

    /**
     *
     * @param {string} oldname
     * @param {string} newname
     * @param {Client} client
     * @static
     */
    NICK: (oldname, newname, client) => {
        client.socket.broadcast(':' + oldname + ' NICK ' + newname);
    },
    /**
     *
     * @param {Socket} socket
     * @static
     */
    HEADER: (socket) => {
        socket.send(':' + config.ip + ' NOTICE AUTH :*** YOU ARE CONNECTED');
    },

    /**
     *
     * @param {Socket} socket
     * @static
     */
    RPL_MOTDSTART: (socket) => {
        socket.send(':'+config.ip+' 375 :- '+config.ip+' Message of the day - ');
    },

    /**
     *
     * @param {Socket} socket
     * @static
     */
    RPL_MOTD: (socket) => {
        socket.send(':'+config.ip+' 372 :- Welcome '+socket.client.identity);
    },

    /**
     *
     * @param {Socket} socket
     * @static
     */

    RPL_ENDOFMOTD: (socket) => {
        socket.send(':'+config.ip+' 376 :End of /MOTD command');
    },

    /**
     *
     * @param {Client} client
     * @param {Client} user
     * @static
     */
    RPL_WHOISUSER: (client, user) => {
        client.socket.send(':'+config.ip+' 311 '+user.name+ ' ' + user.identity + ' ' + config.ip + ' * :'+user.realname);
    },

    /**
     *
     * @param {Client} client
     * @param {string} message
     * @static
     */
    QUIT: (client, message='Gone') => {
        client.socket.broadcast(':'+client.name+' QUIT :'+message);
    },
    RPL_CHANNELMODEIS: (chan, cmd)=> {
        chan.broadcast(':'+config.ip+' 324 '+cmd);
    },
    RPL_UMODEIS: (client, cmd)=> {
        client.socket.send(':'+config.ip+' 221 '+cmd);
    }
};
export default RPLSender