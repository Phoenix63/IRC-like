
// true : coupe le serveur sur une erreur
// false : laisse le serveur tourner sur une erreur

process.env.debug = true;

var def             = require('./modules/def');
var prompter        = require('./prompter.js');
var net             = require('net');
var socketManager   = require('./modules/socket/socket');
var Client          = require('./modules/client/client');
var Logger          = require('./modules/Logger');
var colors          = require('colors');
var shortid         = require('shortid');
var image_server    = require('./modules/imageServer/server');
var config          = require('./config.json');


var commandes = {
    "/message": function(socket, command) {
        socket.logger._CLIENT_SEND_MESSAGE(command);
        socket.broadcast(socket.client.id + ' : '+ command);
    },
    "/w": function(socket, command) {
        var idToSend = command.match(/([a-zA-Z0-9]+[ ])/gi)[0].replace(' ', '');
        try {
            var client = Client.find(idToSend);
            client.socket.send('whisper [from] : '+socket.client.id + ' : '+ command.replace(idToSend+' ', ''));
            socket.send('whisper [to] : '+client.id+' : '+ command.replace(idToSend+' ', ''));
        }
        catch (e) {
            socket.send('Error: can\'t find client '+idToSend);
        }

    }
}

socketManager.create(function(socket) {

    var c = new Client.client(socket);
    var logger = new Logger(c);
    c.socket.logger = logger;

    socket.on('connect', function() {
        logger._CLIENT_CONNECTED();
        c.socket.send('Your name is '+c.id);
    });

    socket.on('message', function(str) {
        var command = str.match(/(\/([a-z])+[ ])/gi);
        if(command && command[0] && commandes[command[0].replace(' ', '')]) {
            commandes[command[0].replace(' ', '')](socket, str.replace(command[0], ''));
        } else {
            socket.send('Unknow command '+str);
        }
    });

    socket.on('end', function() {
        logger._CLIENT_DECONNECTED();
        c.delete();
    });
    socket.on('close', function() {
        logger._CLIENT_DECONNECTED();
        c.delete();
    });

    socket.on('image', function(data) {
        if(data.type === 'png') {
            var base64Data = data.image.replace(/^data:image\/png;base64,/, "");
            var img_path = c.id+"_"+shortid.generate()+".png";
            require("fs").writeFile("images/"+img_path, base64Data, 'base64', function() {
                logger._RECEIVE_IMAGE('http://'+config.ip+':'+config.image_server.port+'/img/'+img_path);
                socket.send('I got your image :)! check http://'+config.ip+':'+config.image_server.port+'/img/'+img_path);
            });
        }
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
                cli.socket.send(ret);
                console.log(colors.green('YOU')+colors.white(' >> ')+ colors.yellow(cli.id)+ ' : '+colors.white(ret));
            } else {
                console.log(colors.yellow('Can\'t find this client...'));
            }
        } else if (req[0] === 'bc' && req[1]) {
            var i = 1;
            var ret = '';
            while(req[i]) {
                ret += req[i]+' ';
                i++;
            }
            Client.list().forEach(function(c) {
                c.socket.send(ret);
                console.log(colors.green('YOU')+colors.white(' >> ')+ colors.yellow(c.id)+ ' : '+colors.white(ret));
            });
        }
    };

    return App;
})();



var app = new App();

prompter(app);