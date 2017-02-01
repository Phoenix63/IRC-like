"use strict"
// true : coupe le serveur sur une erreur
// false : laisse le serveur tourner sur une erreur

process.env.debug = true;

// globals
var net             = require('net');
var colors          = require('colors');
var shortid         = require('shortid');
var prompter        = require('./prompter.js');
var config          = require('./config.json');
var image_server    = require('./modules/imageServer/server');

// socket

var socketManager   = require('./modules/socket/socket');
var Client          = require('./modules/client/client');
var Logger          = require('./modules/Logger');
var MessageManager  = require('./modules/MessageManager');
var ImageManager    = require('./modules/ImageManager');

// channels

var Channel         = require('./modules/channel/Channel');


socketManager.create(function(socket) {

    var c = new Client(socket);
    var logger = new Logger(c);
    c.socket.logger = logger;
    c.socket.messageManager = new MessageManager(c.socket);
    c.socket.imageManager = new ImageManager(c.socket);

    socket.on('connect', function() {
        logger._CLIENT_CONNECTED();

        var channels = Channel.list();
        var drop = '';
        channels.forEach(function(chan) {
            if(chan.flags.indexOf('i')===-1) {
                drop += chan.name+',';
            }
        });
        if(drop.length>0)
            drop = drop.slice(0,-1);
        c.socket.send('['+drop+']');
        //c.name = 'potatoes';
    });

    socket.on('end', function() {
        logger._CLIENT_DECONNECTED();
        c.delete();
    });
    socket.on('close', function() {
        logger._CLIENT_DECONNECTED();
        c.delete();
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
                    ret += i + '\t\t'+ Client.list()[i].name+'\t\t'+ Client.list()[i].id+'\t\t'+Client.list()[i].socket.type+'\n';
                }

                console.log(colors.yellow(ret));
            } else {
                console.log(colors.yellow('no client connected'));
            }
        } else if (req[0] === 'send' && req[1] && req[2]) {
            try {
                var cli = Client.find(req[1]);
                var i = 2;
                ret = '';
                while(req[i]) {
                    ret += req[i]+' ';
                    i++;
                }
                cli.socket.send(ret);
                console.log(colors.green('YOU')+colors.white(' >> ')+ colors.yellow(cli.name)+ ' : '+colors.white(ret));
            } catch(e) {
                console.log(colors.yellow(e));
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
                console.log(colors.green('YOU')+colors.white(' >> ')+ colors.yellow(c.name)+ ' : '+colors.white(ret));
            });
        } else if (req[0] === 'channels') {
            var list = Channel.list(true);
            if(list.length > 0) {
                var ret = '';
                ret += '-- Channels --\n';
                for(var i=0; i<list.length; i++) {
                    ret += i + '\t\t'+ list[i].name + '\t\t' + list[i].users.length+'/'+list[i].maxSize+'\n';
                }

                console.log(colors.yellow(ret));
            } else {
                console.log(colors.yellow('no channel connected'));
            }
        }
    };

    return App;
})();



var app = new App();

prompter(app);