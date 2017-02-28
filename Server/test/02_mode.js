let should = require('should');
let Client = require('./core/Client');
let config = require('./core/config.json');

describe("command MODE:", () => {
    let client = null;
    let client1 = null;
    let client2 = null;
    beforeEach(() => {
        client = null;
        client1 = null;
        client2 = null;
    });
    it('should say unknownflag', (done) => {
        client = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.send('USER test 0 * :test');
        });
        client.on('auth', () => {
            client.send('MODE #fcrtygnjh +x');
        });
        client.on('err_unknownflag', () => {
            client.close();
            done();
        });
    });
    it('should say not such channel', (done) => {
        client = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.send('USER test 0 * :test');
        });
        client.on('auth', () => {
            client.send('MODE #fcrtygnjh +l 60');
        });
        client.on('err_nosuchchannel', () => {
            client.close();
            done();
        });
    });


});
