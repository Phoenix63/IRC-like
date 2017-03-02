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
    it('should say err_nosuchnick', (done) => {
        client = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.send('USER test 0 * :test');
        });
        client.on('auth', () => {
            client.send('INVITE anonymous #chan1');
        });
        client.on('err_nosuchnick', () => {
            client.close();
            done();
        });
    });
    it('should say err_nosuchchannel', (done) => {
        client = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.send('USER test 0 * :test');
        });
        client.on('auth', () => {
            client.send('INVITE test #chan1');
        });
        client.on('err_nosuchchannel', () => {
            client.close();
            done();
        });
    });
    it('should say err_chanoprivneeded', (done) => {
        client = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.send('USER test 0 * :test');
            client2 = new Client(config.port, config.ip);
            client2.on('connect', () => {
                client2.send('USER user2 0 * :user2');
            });
            client2.on('auth', () => {
                client2.send('INVITE user2 #chan');
            });
            client2.on('err_chanoprivneeded', () => {
                client2.close();
                client1.close();
                done();
            });
        });
        client.on('auth', () => {
            client2.send('JOIN #chan');
        });
    });

    /*
    it('should say err_useronchannel', (done) => {
        client = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.send('USER user1 0 * :user1');
            client.send('JOIN #chan1');
            client2.on('connect', () => {
                client2.send('USER user2 0 * :user2');
            });
            client2.on('auth', () => {
                client2.send('JOIN #chan1');
                client2.send('INVITE user1 #chan1');
            });
            client2.on('err_nosuchchannel', () => {
                client2.close();
                done();
            });
        });
    });*/



});
