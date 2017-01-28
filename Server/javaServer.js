var net         = require('net');
var colors      = require('colors');

module.exports = JavaServer;

function JavaServer(centralizedServer){
    var javaServer = net.createServer(function(socket) {
        // Identify this client
        socket.id = socket.remoteAddress + ":" + socket.remotePort;

        centralizedServer.onConnect(socket);

        /*
        /*
        request example, client side :
        socket.emit("data","/setNickname kingofbonobo");
        socket.emit("data","/message hello word");
         */
        socket.on('data', function (data) {
            //La méthode trim() permet de retirer les blancs en début et fin de chaîne.
            var dataParts = data.toString().trim().split(' ');

            //part 0 correspond to the identifiant of the message, for example : /w /setNicknname, ....
            var cmd = dataParts[0];
            var message = "";
            for(var i = 1;i<dataParts.length;i++){
                message += dataParts[i]+" ";
            }
            centralizedServer.onData(socket,cmd,message.trim());
        });

        socket.on('end', function (msg) {
            centralizedServer.onDisconnect(socket)
        });

    });


    javaServer.listen(8088);
};

