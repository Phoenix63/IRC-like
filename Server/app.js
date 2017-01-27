var prompter    = require('./prompter.js');
var net         = require('net');
var colors      = require('colors');

var clients = [];

function findClientByName(name) {
    var arrayLength = clients.length;
    for(var i =0;i<arrayLength;i++){
        if(clients[i].name===name){
            return clients[i];
        }
    }
    return null;
}
function findClientByPseudo(pseudo) {
    var arrayLength = clients.length;
    for(var i =0;i<arrayLength;i++){
        if(clients[i].pseudo===pseudo){
            return clients[i];
        }
    }
    return null;
}


var server = net.createServer(function(socket) {
    // Identify this client
    socket.name = socket.remoteAddress + ":" + socket.remotePort
    clients.push(socket);
    socket.write('Welcome' + socket.name + '\n');
    console.log(socket.name+' has just logged in.');

    socket.on('data', function (data) {
        //La méthode trim() permet de retirer les blancs en début et fin de chaîne.
        if (data.toString().trim() === '') {
            return;
        }
        var dataParts = data.toString().trim().split(' ');
        switch (dataParts[0]){
            case "/message":
                var message = "";
                for(var i = 1;i<dataParts.length;i++){
                    message += dataParts[i]+" ";
                }
                console.log(colors.yellow(socket.name) +" "+socket.pseudo+" "+ colors.grey(' : ') + colors.white(message));
                break;
            case "/initPseudo":
                socket.pseudo = dataParts[1];
                console.log(colors.yellow(socket.name) +" has indicate his pseudo : "+socket.pseudo);
                break;
        }

    });
    function broadcast(message, sender) {
        clients.forEach(function (client) {
            // Don't want to send it to sender
            if (client === sender) return;
            client.write(message);
        });
    }

    socket.on('end', function (msg) {
        console.log(colors.red((msg||"")+socket.name + ' DISCONNECTED'));
        clients.splice(clients.indexOf(socket), 1);
    });


});
server.on('listening', function () {
    console.log('Server listening');
});

server.on('close', function () {
    console.log('Server is now closed');
});
server.on('error', function (err) {
    console.log('error:', err);
});
server.listen(8088);

function App(){

}
App.prototype.query = function(str) {
    var req = str.split(' ');
    if(req[0] === '/clients') {
        if(clients.length > 0) {
            var ret = '';
            ret += '-- Client list --\n';
            for(var i=0; i<clients.length; i++) {
                ret += i + '\t\t'+clients[i].name+'\n';
            }

            console.log(colors.yellow(ret));
        } else {
            console.log(colors.yellow('No client connected'));
        }
    } else if (req[0] === '/w' && req[1] && req[2]) {
        var cli = clients[req[1]];
        if(cli) {
            var i = 2;
            ret = '';
            while(req[i]) {
                ret += req[i]+' ';
                i++;
            }
            cli.write(ret+'\n');
            console.log(colors.green('YOU')+colors.white(' >> ')+ colors.yellow(cli.name)+" "+ colors.white(ret));
        } else {
            console.log(colors.yellow('Can\'t find this client...'));
        }
    } else if (req[0] === '/bc' && req[1]) {
        var i = 2;
        var ret = '';
        while(req[i]) {
            ret += req[i]+' ';
            i++;
        }
        var msg = colors.gren('YOU')+colors.white(' >> ')+ colors.yellow(c.name)+ colors.white(ret);
        server.broadcast(msg,req[1]);
    } else if (req[0] === '/kick' && req[1]) {
        var cli = clients[req[1]];
        if(cli) {
            cli.emit('end');
        } else {
            console.log(colors.yellow('Can\'t find this client...'));
        }
    }
};


var app = new App();

prompter(app);

