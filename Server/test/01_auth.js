let should = require('should');
let Client = require('./core/Client');
let config = require('./core/config.json');

describe("Auth:", () => {
    let client = null;
    let client1 = null;
    let client2 = null;
    beforeEach(() => {
        client = null;
        client1 = null;
        client2 = null;
    });
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