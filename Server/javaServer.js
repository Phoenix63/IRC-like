var net         = require('net');
var colors      = require('colors');
var config = require('./config.json');

//trigger when a client disconnects roughly
process.on('uncaughtException', function (err) {
    console.log('\t\t'+colors.red(err));
});

module.exports = JavaServer;

function JavaServer(centralizedServer){
    var javaServer = net.createServer(function(socket) {
        // Identify this client
        socket.id = socket.remoteAddress + ":" + socket.remotePort;
        //notify centralized server of a new connection
        centralizedServer.onConnect(socket);

        socket.on('data', function (data) {
            //La méthode trim() permet de retirer les blancs en début et fin de chaîne.
            var dataParts = data.toString().trim().split(' ');
            var cmd = dataParts[0];
            var message = "";
            for(var i = 1;i<dataParts.length;i++){
                message += dataParts[i]+" ";
            }
            centralizedServer.onData(socket,cmd,message.trim());
        });

        socket.on('end', function (msg) {
            centralizedServer.onDisconnect(socket);
        });
    });
    javaServer.listen(config.tcp_server.port, config.tcp_server.ip);
};

