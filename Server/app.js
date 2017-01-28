var prompter    = require('./prompter.js');
var net         = require('net');
var colors      = require('colors');
var config      = require('./config.json');
var socketManager   = require('./modules/socket/socket');
var Client      = require('./modules/client/client');

process.on('uncaughtException', function (err) {
    console.log('\t\t'+colors.red(err));
});



socketManager.create(function(socket) {

    var c = new Client.client(socket);
    console.log('new client ('+socket.type+') '+c.id);
    c.socket.send('Your name is '+c.id);

    socket.on('message', function(str) {
        console.log(colors.yellow(c.id) + colors.grey(' : ') + colors.white(str));
        socket.broadcast(c.id + ' : '+ str);
    });
});

var App = (function() {

    function App() {

    }

    App.prototype.query = function(str) {
        var req = str.split(' ');
        if(req[0] === 'clients') {
            if(Client.list().length > 0) {
                var ret = '';
                ret += '-- Client list --\n';
                for(var i=0; i<Client.list().length; i++) {
                    ret += i + '\t\t'+Client.list()[i].id+'\t\t'+Client.list()[i].socket.type+'\n';
                }

                console.log(colors.yellow(ret));
            } else {
                console.log(colors.yellow('no client connected'));
            }
        } else if (req[0] === 'send' && req[1] && req[2]) {
            var cli = Client.find(req[1]);
            if(cli) {
                var i = 2;
                ret = '';
                while(req[i]) {
                    ret += req[i]+' ';
                    i++;
                }
                cli.socket.send(ret+'\n');
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
            Client.list().forEach(function(c) {
                c.socket.send(ret+'\n');
                console.log(colors.green('YOU')+colors.white(' >> ')+ colors.yellow(cli.name)+ ' : '+colors.white(ret));
            });
        }
    };

    return App;
})();



var app = new App();

prompter(app);