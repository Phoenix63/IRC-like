/**
 * Created by titir on 15/02/2017.
 */
import ERRSender from './../responses/ERRSender';
import RPLSender from './../responses/RPLSender';
import Channel from './../channel/Channel';

module.exports = function (socket, command) {
    if (!socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'TOPIC');
        return;
    }
    if (command[1] === null) {
        ERRSender.ERR_NEEDMOREPARAMS(socket.client, 'TOPIC');
        return;
    }
    let cmd = command[1].split(' ');
    let chan = cmd[0];
    cmd = cmd.splice(1, cmd.length);
    let newTopic = cmd.join(' ');
    if (newTopic[0] === ':') {
        newTopic = newTopic.slice(1, newTopic.length);
    }

    Channel.list().forEach((c) => {
        if (c.name === chan) {
            if (newTopic === null || newTopic === '') {
                RPLSender.RPL_TOPIC('TOPIC', socket.client, c);
            } else {
                if ((c.channelFlags.indexOf('t') > -1 && c.isUserOperator(socket.client)) || (c.channelFlags.indexOf('t') === -1)) {
                    c.topic = newTopic;
                    RPLSender.RPL_TOPIC('TOPIC', socket.client, c);
                } else {
                    ERRSender.ERR_CHANOPRIVSNEEDED(socket.client, c.name);
                }
            }
        }
    });
}