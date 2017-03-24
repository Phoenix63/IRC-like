var should = require('should');
var Client = require('./core/Client');
var config = require('./core/config.json');
var sconfig = require('./../dist/config.json');

describe("command RMFILE:", () => {
    var client, client1;
    it('should say not connected', (done) => {
        client = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.send('RMFILE #test http://test');
        });
        client.on('err_notregistered', () => {
            client.close();
            done();
        });
    });
    it('should say no such channel', (done) => {
        client = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.send('USER test 0 * :test');
        });
        client.on('auth', () => {
            client.send('RMFILE #test http://test');
        });
        client.on('err_nosuchchannel', () => {
            client.close();
            done();
        });
    });
    it('should say not enougth parameters', () => {
        client = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.send('USER test 0 * :test');
        });
        client.on('auth', () => {
            client.send('JOIN #test');
        });
        client.on('rpl_namreply', () => {
            client.send('RMFILE #test');
        });
        client.on('err_needmoreparams', () => {
            client.close();
            done();
        })
    });
    it('should say oprivneeded', (done) => {
        client = new Client(config.port, config.ip);
        client1 = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.send('USER test 0 * :test');
        });
        client.on('auth', () => {
            client.send('JOIN #test');
        });
        client.on('rpl_namreply', () => {
            client1.send('USER test1 0 * :test');
        });
        client1.on('auth', () => {
            client1.send('JOIN #test');
        });
        client1.on('rpl_namreply', () => {
            client1.send('RMFILE #test http://test');
        });
        client1.on('err_chanoprivneeded', () => {
            client.close();
            client1.close();
            done();
        });
    });
    it('should remove file', (done) => {
        client = new Client(config.port, config.ip);
        let pass = 0;
        client.on('connect', () => {
            client.send('USER test 0 * :test');
        });
        client.on('auth', () => {
            client.send('JOIN #test');
        });
        client.on('rpl_namreply', () => {
            client.send('PRIVMSG #test :this is a test http://'+sconfig.image_server.outip+':'+sconfig.image_server.port+'/public/test');
            client.send('LISTFILES #test');
        });
        client.on('listfiles', () => {
            client.send('RMFILE #test http://'+sconfig.image_server.outip+':'+sconfig.image_server.port);
            client.send('LISTFILES #test');
            client.on('listfiles', () => {
                client.close();
                done();
            })
        });
    });
});