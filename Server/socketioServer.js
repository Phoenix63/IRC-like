var http = require('http');
var fs = require('fs');

module.exports = SocketioServer;


function SocketioServer(centralizedServer) {
    var socketioServer = http.createServer(function (req, res) {
        fs.readFile('../Webclient/index.html', 'utf-8', function (error, content) {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(content);
        });
    });
    var io = require('socket.io').listen(socketioServer);

    io.sockets.on('connection', function (socket) {

        //we create socket.write in socketio, to emit easly since centralizedServer
        socket.write = function (message) {
            socket.emit("data", message);
        };

        centralizedServer.onConnect(socket);

        //meme si avec socketio on peut faire socket.on("machintruc"), on en créé qu'un seul : on("data") pour que ce soit pareil que javaServer.js c plus simple, on gere le reste dans centralized Server
        socket.on('data', function (data) {
            //La méthode trim() permet de retirer les blancs en début et fin de chaîne.
            var dataParts = data.toString().trim().split(' ');

            //part 0 correspond to the identifiant of the message, for example : /w /setNicknname, ....
            var cmd = dataParts[0];
            var message = "";
            for (var i = 1; i < dataParts.length; i++) {
                message += dataParts[i] + " ";
            }
            centralizedServer.onData(socket, cmd, message.trim());
        });

        socket.on("disconnect", function () {
            centralizedServer.onDisconnect(socket);
        });
    });
    socketioServer.listen(8087);
}
