var should = require('should');
var Client = require('./core/Client');
var config = require('./core/config.json');

describe("command MODE:", () => {
    var client, client1, client2;
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
    it('should say you\'re not channel operator', (done) => {
        client1 = new Client(config.port, config.ip);

        client1.on('connect', () => {
            client1.send('NICK user1');
            client1.send('USER user1 0 * :user1');
        });
        client1.on('auth', () => {
            client1.send('JOIN #chan33');
            client2 = new Client(config.port, config.ip);
            client2.on('connect', () => {
                client1.send('NICK user2');
                client2.send('USER user2 0 * :user2');
            });
            client2.on('auth', () => {
                client2.send('JOIN #chan33');
                client2.send('MODE #chan33 +l 27');
            });
            client2.on('err_chanoprivneeded', () => {
                client2.close();
                client1.close();
                done();
            });
        });
    });
});
