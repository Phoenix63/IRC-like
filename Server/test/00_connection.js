let should = require('should');
let Client = require('./core/Client');
let config = require('./core/config.json');

describe("Connection:",() => {
    let client = null;
    let client1 = null;
    let client2 = null;
    beforeEach(() => {
        client = null;
        client1 = null;
        client2 = null;
    });
    it('should connect to the server', (done) => {
        let client = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.close();
            done();
        });
    });
});