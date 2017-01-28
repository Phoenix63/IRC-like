var prompter    = require('./prompter.js');
var net         = require('net');
var shortId     = require('shortid');
var colors      = require('colors');
var config      = require('./config.json');

var clients = [];


process.on('uncaughtException', function (err) {
    console.log('\t\t'+colors.red(err));
});

function findClient(id) {
    for(var key in clients) {
        if( key === id || clients[key].name === id) {
            return clients[key];
        }
    }
    return null;
}

var server = net.createServer(function(socket) {



    socket.name = shortId.generate();

    clients.push(socket);

    socket.write('Your name is ' + socket.name + '\n');
    console.log('new client : ' + socket.name);

    socket.buffer = '';

    socket.on('data', function (data) {
        var lines = data.toString().split(/\n|\r/),
            i, line;

        for (i = 0; i < lines.length - 1; i += 1) {
            line = socket.buffer + lines[i];
            socket.buffer = '';

            if (line.length <= 510) {
                socket.emit('message', line);
            } else {
                console.warn(socket.remoteAddress, socket.name,
                    'Bufferoverflow');
                socket.buffer = '';
            }
        }

        socket.buffer += lines[lines.length - 1];
        if (socket.buffer.length >= 510) {
            console.warn(socket.remoteAddress, socket.name, 'Bufferoverflow.');
            socket.buffer = '';
        }
    });

    socket.on('message', function (msg) {
        if (msg.trim() === '') {
            return;
        }
        console.log(colors.yellow(socket.name) + colors.grey(' : ') + colors.white(msg));
    });

    socket.on('close', function() {
        socket.emit('end', 'CLOSESOC :: ');
    });
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

server.listen(config.tcp_server.port, config.tcp_server.ip);

var App = (function() {

    function App() {

    }

    App.prototype.query = function(str) {
        var req = str.split(' ');
        if(req[0] === 'clients') {
            if(clients.length > 0) {
                var ret = '';
                ret += '-- Client list --\n';
                for(var i=0; i<clients.length; i++) {
                    ret += i + '\t\t'+clients[i].name+'\n';
                }

                console.log(colors.yellow(ret));
            } else {
                console.log(colors.yellow('no client connected'));
            }
        } else if (req[0] === 'send' && req[1] && req[2]) {
            var cli = findClient(req[1]);
            if(cli) {
                var i = 2;
                ret = '';
                while(req[i]) {
                    ret += req[i]+' ';
                    i++;
                }
                cli.write(ret+'\n');
                console.log(colors.green('YOU')+colors.white(' >> ')+ colors.yellow(cli.name)+ ' : '+colors.white(ret));
            } else {
                console.log(colors.yellow('Can\'t find this client...'));
            }
        } else if (req[0] === 'bc' && req[1]) {
            var i = 2;
            var ret = '';
            while(req[i]) {
                ret += req[i]+' ';
                i++;
            }
            clients.forEach(function(c) {
                c.write(ret+'\n');
                console.log(colors.green('YOU')+colors.white(' >> ')+ colors.yellow(cli.name)+ ' : '+colors.white(ret));
            });
        } else if (req[0] === 'kick' && req[1]) {
            var cli = findClient(req[1]);
            if(cli) {
                cli.emit('end');
            } else {
                console.log(colors.yellow('Can\'t find this client...'));
            }
        }
    };

    return App;
})();

var app = new App();

prompter(app);

