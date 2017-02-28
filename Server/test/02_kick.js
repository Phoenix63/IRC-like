let should = require('should');
let Client = require('./core/Client');
let config = require('./core/config.json');

describe("command KICK:", () => {
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
            client.send('KICK #test test');
        });
        client.on('err_notregistered', () => {
            client.close();
            done();
        });
    });
    it('should say no such channel', (done) => {
        client = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.send('USER test 0 * :test');
        });
        client.on('auth', () => {
            client.send('KICK #test test');
        });
        client.on('err_nosuchchannel', () => {
            client.close();
            done();
        });
    });
    it('should say not operator', (done) => {
        client1 = new Client(config.port, config.ip);
        client2 = new Client(config.port, config.ip);
        client1.on('connect', () => {
            client1.send('NICK test1');
            client1.send('USER test1 0 * :test1');
        });
        client1.on('auth', () => {
            client1.send('JOIN #test');
            client2.send('NICK test2');
            client2.send('USER test2 0 * :test2');
        });

        client2.on('auth', () => {
            client2.send('JOIN #test');
        });

        client2.on('rpl_namreply', (message) => {
            if(message.indexOf('@test1 test2') > 0) {
                client2.send('KICK #test test1');
            }
        });

        client2.on('err_chanoprivneeded', () => {
            client1.close();
            client2.close();
            done();
        });
    });
    it('should kick user', (done) => {
        client1 = new Client(config.port, config.ip);
        client2 = new Client(config.port, config.ip);
        client1.on('connect', () => {
            client1.send('NICK test1');
            client1.send('USER test1 0 * :test1');
        });
        client1.on('auth', () => {
            client1.send('JOIN #test');
            client2.send('NICK test2');
            client2.send('USER test2 0 * :test2');
        });

        client2.on('auth', () => {
            client2.send('JOIN #test');
        });

        client2.on('rpl_namreply', (message) => {
            client2.send('PRIVMSG #test :test');
        });
        client1.on('privmsg', () => {
            client1.send('KICK #test test2');
        });

        client1.on('kick', () => {
            client1.close();
            client2.close();
            done();
        });
    });
});
