var should = require('should');
var Client = require('./core/Client');
var config = require('./core/config.json');

describe("command NICK:", () => {
    var client, client1, client2;
    it('should change nickname', (done) => {
        client = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.send('USER test 0 * :test');
        });
        client.on('auth', () => {
            client.send('NICK testchange');
        });
        client.on('nick', (message) => {
            client.close();
            done();
        });
    });
    it('should not change nickname', (done) => {
        client1 = new Client(config.port, config.ip);
        client2 = new Client(config.port, config.ip);

        client1.on('connect', () => {
            client1.send('NICK test');
        });

        client2.on('nick', () => {
            client2.send('NICK test');
        });

        client2.on('err_nicknameinuse', () => {
            client1.close();
            client2.close();
            done();
        })
    });
    it('should change guest nick', (done) => {
        client1 = new Client(config.port, config.ip);


        client1.on('connect', () => {
            client1.send('NICK nick3');
            client1.send('USER nick3 0 * :nick3');
        });

        client1.on('auth', () => {
            client2 = new Client(config.port, config.ip);

            client2.on('connect', () => {
                client2.send('PASS admin');
                client2.send('USER admin 0 * :admin');
            });

            client2.on('auth', () => {
                client2.send('NICK nick3');
            });

            client2.on('nick', (message) => {
                if(message.indexOf('NICK nick3') >= 0) {
                    client1.close();
                    client2.close();
                    done();
                    client2.on('nick', function(){});
                }
            });
        });


    });
});
