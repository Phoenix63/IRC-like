var should = require('should');
var Client = require('./core/Client');
var config = require('./core/config.json');
var sconfig = require('./../dist/config.json');

describe("command LISTFILES:", () => {
    var client, client1;
    it('should say not connected', (done) => {
        client = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.send('LISTFILES #test');
        });
        client.on('err_notregistered', () => {
            client.close();
            done();
        });
    });
    it('should list files', (done) => {
        client = new Client(config.port, config.ip);
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
            client.close();
            done();
        });
    });
});