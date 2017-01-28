var colors = require('colors');

module.exports = Logger;

function Logger() {

}
Logger.prototype.socketAction = function(socket,message){
    if(socket.nickname != null){
        console.log(colors.yellow(socket.id) + " (" +socket.nickname +'), '+ colors.white(message));
    }else{
        console.log(colors.yellow(socket.id) + colors.grey(' ') + colors.white(message));
    }
};

Logger.prototype.error = function(message){
    console.log(colors.red(message));
};
Logger.prototype.information = function(message){
    console.log(colors.orange(message));
}