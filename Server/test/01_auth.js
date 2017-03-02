var should = require('should');
var Client = require('./core/Client');
var config = require('./core/config.json');

describe("Auth:", () => {
    var client;
    it('should say connected as GUEST', (done) => {

        client = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.send('USER guest 0 * :I am a guest');
        });
        client.on('auth', (message) => {
            message.should.containEql(' GUEST_guest');
            client.close();
            done();
        });

    });
    it('should say connected as USER', (done) => {
        client = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.send('PASS admin');
            client.send('USER admin 0 * :admin');
        });
        client.on('auth', (message) => {
            message.should.containEql(' admin');
            client.close();
            done();
        });
    });
});