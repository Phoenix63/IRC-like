let should = require('should');
let Client = require('./core/Client');
let config = require('./core/config.json');

describe('command WHOIS:', () => {
    let client = null;
    let client1 = null;
    let client2 = null;
    beforeEach(() => {
        client = null;
        client1 = null;
        client2 = null;
    });
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
            message.should.equal(':'+config.name+' 311 test GUEST_test ' + config.name + ' * :test');
            client.close();
            done();
        });
    });
});