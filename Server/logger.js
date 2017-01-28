var colors = require('colors');

module.exports = logger;

function Logger() {

}
Logger.prototype.socketAction = function(socket,message){
    if(socket.nickname != null){
        console.log(colors.yellow(socket.name) + " " +socket.nickname + " " + colors.grey(' : ') + colors.white(message));
    }else{
        console.log(colors.yellow(socket.name) + colors.grey(' : ') + colors.white(message));
    }
};

Logger.prototype.error = function(message){
    console.log(colors.red(message));
};