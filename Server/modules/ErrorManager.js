
function sendErr(err, socket) {
    socket.send(err);
}

Errors = {
    ERR_UNKNOWCOMMAND: function(socket) {
        sendErr("ERR_UNKNOWCOMMAND", socket);
    },
    ERR_NICKCOLLISION: function(socket) {
        sendErr("ERR_NICKCOLLISION", socket);
    },
    ERR_NONICKNAMEGIVEN: function(socket) {
        sendErr("ERR_NONICKNAMEGIVEN", socket);
    }
};

module.exports = Errors;