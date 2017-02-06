module.exports = function(socket, command){
    socket.client.name = command[1].split(' ')[0];
}