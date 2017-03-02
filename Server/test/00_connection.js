var should = require('should');
var Client = require('./core/Client');
var config = require('./core/config.json');

describe("Connection:",() => {
    var client;
    it('should connect to the server', (done) => {
        client = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.close();
            done();
        });
    });
});