
function sendErr(err, socket) {
    socket.send(err);
}

Errors = {
    ERR_UNKNOWCOMMAND: function(socket) {
        sendErr("ERR_UNKNOWCOMMAND", socket);
    },
    ERR_NICKNAMEINUSE: function(socket) {
        sendErr("ERR_NICKNAMEINUSE", socket);
    },
    ERR_NONICKNAMEGIVEN: function(socket) {
        sendErr("ERR_NONICKNAMEGIVEN", socket);
    },
    ERR_NOTOPONCHANNEL: function(socket) {
        sendErr("ERR_NOTOPONCHANNEL", socket);
    },
    ERR_NOSUCHCHANNEL: function(socket) {
        sendErr("ERR_NOSUCHCHANNEL", socket);
    },
    ERR_BANNEDFROMCHAN: function(socket) {
        sendErr("ERR_BANNEDFROMCHAN", socket);
    },
    ERR_INVITEONLYCHAN: function(socket) {
        sendErr("ERR_INVITEONLYCHAN", socket);
    },
    ERR_BADCHANNELKEY: function(socket) {
        sendErr("ERR_BADCHANNELKEY", socket);
    },
    ERR_CHANNELISFULL: function(socket) {
        sendErr("ERR_CHANNELISFULL", socket);
    },
    ERR_NOTEXTTOSEND: function(socket) {
        sendErr("ERR_NOTEXTTOSEND", socket);
    },
    ERR_CANNOTSENDTOCHAN: function(socket) {
        sendErr("ERR_CANNOTSENDTOCHAN", socket);
    },
    ERR_NORECIPIENT: function(socket) {
        sendErr("ERR_NORECIPIENT", socket);
    },
    RPL_NAMREPLY: function(socket) {
        sendErr("RPL_NAMREPLY", socket);
    },
    RPL_ENDOFNAMES: function(socket) {
        sendErr("RPL_ENDOFNAMES", socket);
    },
    RPL_LIST: function(socket) {
        sendErr("RPL_LIST", socket);
    },
    RPL_LISTSTART: function(socket) {
        sendErr("RPL_LISTSTART", socket);
    },
    RPL_LISTEND: function(socket) {
        sendErr("RPL_LISTEND", socket);
    }
};

module.exports = Errors;