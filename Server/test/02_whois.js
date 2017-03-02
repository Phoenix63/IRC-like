var should = require('should');
var Client = require('./core/Client');
var config = require('./core/config.json');

describe('command WHOIS:', () => {
    var client;
    it('should say not registered', (done) => {
        client = new Client(config.port, config.ip);

        client.on('connect', () => {
            client.send('WHOIS test');
        });
        client.on('err_notregistered', (message) => {
            client.close();
            done();
        });
    });
    it('should say no nickname given', (done) => {
        client = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.send('USER test 0 * :test');
        });
        client.on('auth', () => {
            client.send('WHOIS');
        });

        client.on('err_nonicknamegiven', () => {
            client.close();
            done();
        });
    });
    it('sould work', (done) => {
        client = new Client(config.port, config.ip);

        client.on('connect', () => {
            client.send('NICK test');
            client.send('USER test 0 * :test');
        });

        client.on('auth', () => {
            client.send('WHOIS test');
        });

        client.on('rpl_whois', (message) => {
            message.should.equal(':'+config.ip+' 311 test GUEST_test ' + config.ip + ' * :test');
            client.close();
            done();
        });
    });
});