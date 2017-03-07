
import ERRSender from './../responses/ERRSender';
import RPLSender from './../responses/RPLSender';
import Channel from './../channel/Channel';

module.exports = (socket, command) => {

    let argv = /^(#[^, ]+) ([^ ]+)/g.exec(command[1]);

    if(!argv) {
        ERRSender.ERR_NEEDMOREPARAMS(socket.client, 'RMFILE');
        return;
    }

    let channel = argv[1];
    let url = argv[2];

    let chan = Channel.getChannelByName(channel);
    if(!chan) {
        ERRSender.ERR_NOSUCHCHANNEL(socket.client, channel);
        return;
    }

    if(!chan.isUserOperator(socket.client)) {
        ERRSender.ERR_CHANOPRIVSNEEDED(socket.client, channel);
        return;
    }

    if(url === '*') {
        chan.deleteFiles();
    } else {
        chan.removeFile(url);
    }
    RPLSender.RMFILE(socket, chan, url);

}