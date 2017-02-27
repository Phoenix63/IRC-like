var should = require('should');
var Client = require('./core/Client');
var config = require('./core/config.json');

describe('command PART:', () => {
    var client = null;
    var client1 = null;
    var client2 = null;
    beforeEach(() => {
        client = null;
        client1 = null;
        client2 = null;
    });
    it('should say not registered', (done) => {
        client = new Client(config.port, config.ip);

        client.on('connect', () => {
            client.send('PART #test');
        });
        client.on('err_notregistered', (message) => {
            client.close();
            done();
        });
    });
    it('should part from the channel', (done) => {
        client = new Client(config.port, config.ip);

        client.on('connect', () => {
            client.send('USER test 0 * :test');
        });
        client.on('auth', () => {
            client.send('JOIN #test');
        });
        client.on('join', () => {
            client.send('PART #test');
        });
        client.on('part', () => {
            client.close();
            done();
        });
    });
});