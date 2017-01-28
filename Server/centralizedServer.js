var JavaServer = require('./javaServer.js');
var SocketioServer = require('./socketioServer');
var Logger = require('./logger.js');



function Server(){
    this.clients = [];
    this.logger = new Logger();
    this.emitter = new Emitter();

}
Server.prototype.broadcast = function(data, sender){

};
//for example /w salut ------------- /w = cmd | salut = data
Server.prototype.onData = function(socket, cmd, data){
    switch (cmd){
        case "/message":
            this.logger.socketAction(socket, "has written -> "+data);
            break;
        case "/setNickname":
            //if the value is null we create a random nickname
            socket.nickname = data;
            if(socket.nickname===null){
                socket.nickname = 'an unnamed cell';
            }
            this.logger.socketAction(socket, "has modify his nickname");
            break;
        default :
            console.log("Commande non reconnu : "+cmd);
            this.logger.error("Commande non reconnu !!!")
    }
};
Server.prototype.onConnect = function(socket){
    this.logger.socketAction(socket,"is now connected to the server");
    this.clients.push(socket);
};
Server.prototype.onDisconnect = function(socket){
    this.logger.socketAction(socket,"is now disconnected to the server");
    clients.splice(clients.indexOf(socket), 1);
};

var server = new Server();
var javaServer = new JavaServer(server);
var socketioServer = new SocketioServer(server);

