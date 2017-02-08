"use strict"

import Client from './client/client';
import colors from 'colors';

function throwError(client, message) {
    if(client && client.socket && client.socket.emit)
        client.socket.emit('end');
    throw "ConfMessage : "+ message;
}

class Logger {

    constructor(client){
        if(!client instanceof Client)
            throwError(client, "Logger have an instance of Client");
        this.client = client;
    }

    _CLIENT_CONNECTED() {
        console.log(colors.yellow(this.client.name + ' join the server with '+ this.client.socket.type+' connection'));
    }
    _CLIENT_SEND_MESSAGE(message) {
        if(!message)
            throwError(this.client, "_CLIENT_SEND_MESSAGE must have a String");
        console.log(colors.yellow(this.client.name) + colors.grey(' : ') + colors.white(message));
    }
    _CLIENT_DECONNECTED() {
        console.log(colors.yellow(this.client.name + ' leave the server'));
    }
    _RECEIVE_IMAGE(path) {
        if(!path)
            throwError(this.client, " _RECEIVE_IMAGE must have a String");
        console.log(colors.yellow(this.client.name)+ colors.grey(' : ') + colors.white('Send image '+path));
    };
    _USER_CHANGE_NICK(newName) {
        console.log(colors.yellow(this.client.name) + colors.green(' change is nickname to '+ newName));
    };
    _SEND_TO_CLIENT(message) {
        console.log(colors.grey('[to] ')+colors.green(this.client.name)+ '<< '+message);
    };
    _USER_SEND_CMD(message) {
        console.log(colors.grey('[from] ')+colors.red(this.client.name)+ '>> '+message);
    }
}

export default Logger;

