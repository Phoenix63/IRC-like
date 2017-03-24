var should = require('should');
var Client = require('./core/Client');
var config = require('./core/config.json');

describe('command PRIVMSG:', () => {
    var client, client1, client2;
    it('should say not registered', (done) => {
        client = new Client(config.port, config.ip);

        client.on('connect', () => {
            client.send('PRIVMSG #test :test');
        });
        client.on('err_notregistered', (message) => {
            client.close();
            done();
        });
    });
    it('sould say no text to send', (done) => {
        client = new Client(config.port, config.ip);

        client.on('connect', () => {
            client.send('USER test 0 * :test');
        });
        client.on('auth', () => {
            client.send('JOIN #test');
        });
        client.on('join', () => {
            client.send('PRIVMSG #test');
        });
        client.on('err_notexttosend', (message) => {
            client.close();
            client = null;
            done();
        });
    });
    it('should say nosuchnick', (done) => {
        client = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.send('USER test 0 * :test');
        });
        client.on('auth', () => {
            client.send('PRIVMSG test :test');
        });
        client.on('err_nosuchnick', (message) => {
            client.close();
            done();
        });
    });
    it('should say nosuchchannel', (done) => {
        client = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.send('USER test 0 * :test');
        });
        client.on('auth', () => {
            client.send('PRIVMSG #test :test');
        });
        client.on('err_nosuchchannel', (message) => {
            client.close();
            done();
        });
    });
    it('should say not on channel', (done) => {
        client1 = new Client(config.port, config.ip);
        client1.on('connect', () => {
            client1.send('USER test 0 * :test');
        });
        client1.on('auth', () => {
            client1.send('JOIN #test');
        });

        client1.on('rpl_namreply', () => {
            client2 = new Client(config.port, config.ip);

            client2.on('connect', () => {
                client2.send('USER test2 0 * :test2');
            });

            client2.on('auth', () => {
                client2.send('PRIVMSG #test :test');
            });

            client2.on('err_cannotsendtochan', () => {
                client1.close();
                client2.close();
                done();
            });
        });
    });
    it('should send a privmsg to user', (done) => {
        client1 = new Client(config.port, config.ip);
        client2 = new Client(config.port, config.ip);

        client1.on('connect', () => {
            client1.send('NICK sendpriv1');
            client1.send('USER sendpriv1 0 * :sendpriv1');
        });

        client1.on('auth', () => {
            client2.send('NICK iamatest');
            client2.send('USER sendpriv2 0 * :sendpriv');
        });

        client2.on('auth', () => {
            client2.send('PRIVMSG sendpriv1 :this is a test');
        });
        client2.on('err_norecipient', (message) => {
            message.should.equal('');
            done();
        });

        client1.on('privmsg', (message) => {
            message.should.equal(':iamatest PRIVMSG sendpriv1 :this is a test');
            client1.close();
            client2.close();
            done();
        });
    });
});