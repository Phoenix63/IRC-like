var shortid     = require('shortid');

var clients = [];

Client = (function () {

    function Client(socket) {
        this.id = shortid.generate();
        this.socket = socket;
        clients.push(this);
    }

    Client.prototype.delete = function () {
        clients.splice(clients.indexOf(this), 1);
        this.destroy();
    }

    return Client;
})();

function findClient(id) {
    for(var key in clients) {
        if( key === id || clients[key].name === id) {
            return clients[key];
        }
    }
    throw "Client "+id+" is not in the list";
    return null;
}

function getList() {
    return clients;
}

module.exports = {
    client: Client,
    find: findClient,
    list: getList
};