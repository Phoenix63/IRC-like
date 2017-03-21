const config = require('./../../config.json');

module.exports = function(socket, command) {
    socket.send(':'+config.ip+' PONG '+(command[1]||':pong'));
}