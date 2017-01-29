var Logger = require('./logger.js');
var prompter = require('./prompter.js');
var JavaServer = require('./javaServer.js');
var SocketioServer = require('./socketioServer.js');
var DataBase = require('./database.js');


function CentralizedServer(){
    this.clients = [];
    this.logger = new Logger();
}

CentralizedServer.prototype.onData = function(socket, cmd, message){
    switch (cmd){
        case "/message":
            this.logger.socketAction(socket, "has written -> "+message);
            this.broadcast("/message "+socket.nickname+" has written : "+message+"\n", socket);
            break;

        case "/nickname":
            //if the value is null we create a random nickname
            socket.nickname = message;
            if(socket.nickname===null){
                socket.nickname = 'an unnamed cell';
            }
            this.logger.socketAction(socket, "has indicate his nickname");
            this.broadcast("/message "+socket.nickname+" join the chat\n", socket);
            break;

        case "/ping":
            socket.write("/pong\n");
            break;

        default :
            console.log("Commande non reconnu : "+cmd);
            this.logger.error("Commande "+cmd+" non reconnu !!!");
    }
};

CentralizedServer.prototype.onConnect = function(socket){
    this.clients.push(socket);
    this.logger.socketAction(socket,"is now connected to the server");
};

CentralizedServer.prototype.onDisconnect = function(socket){
    this.logger.socketAction(socket,"is now disconnected to the server");
    this.clients.splice(this.clients.indexOf(socket), 1);
};

CentralizedServer.prototype.broadcast = function(data, sender){
    this.clients.forEach(function(client){
        if(client.id===sender.id) return;
        //client.write is create in socket to call socket.emit("data","message")
        client.write(data);
    });
};

CentralizedServer.prototype.onCommand = function(commandLine){
    var parts = commandLine.split(' ');
    switch (parts[0]){
        case "/clients":
            var str = "Il y a actuellement "+this.clients.length+" client(s) connecté(s)\n";
            if(this.clients.length>0){
                this.clients.forEach(function(client){
                    str += client.nickname+" ";
                });
                str += "\n";
            }
            this.logger.information(str);
            break;
        case "/broadcast":
            var str = "/message Broadcast from server : ";
            for(var i = 1;i<parts.length;i++){
                str += parts[i]+" "
            }
            str.trim();
            str += "\n";
            this.broadcast(str,-1);
            break;

        default :
            this.logger.error("Commande "+parts[0]+" non reconnu !!!");
    }
};

var centralizedServer = new CentralizedServer();
var javaServer = new JavaServer(centralizedServer);
var socketioServer = new SocketioServer(centralizedServer);


prompter(centralizedServer);


//var testDB = new DataBase();
