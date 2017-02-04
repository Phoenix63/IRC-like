
module.exports = function(socket, command) {

    if(!socket.client.identity) {
        socket.send(':'+config.ip+' 451 * QUIT :You have not registered');
        return;
    }

    socket.client.delete();
}