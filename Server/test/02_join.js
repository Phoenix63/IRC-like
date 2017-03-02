var should = require('should');
var Client = require('./core/Client');
var config = require('./core/config.json');

describe('command JOIN:', () => {
    var client, client1;
    it('should say not registered', (done) => {
        client = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.send('JOIN #test');
        });
        client.on('err_notregistered', () => {
            client.close();
            done();
        });
    });
    it('should say invalid name', (done) => {
        client = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.send('USER test 0 * :test');
        });
        client.on('auth', () => {
            client.send('JOIN invalidchannelname');
        });
        client.on('err_nosuchchannel', (message) => {
            message.should.equal(':' + config.name + ' 403 invalidchannelname :No such channel');
            client.close();
            done();
        });
    });
    it('should join a channel as operator', (done) => {
        client = new Client(config.port, config.ip);
        client.on('connect', () => {
            client.send('NICK test');
            client.send('USER test 0 * :test operator');
        });
        client.on('auth', () => {
            client.send('JOIN #test');
        });
        client.on('rpl_namreply', (message) => {
            message.should.containEql('353 test = #test :@test');
            client.close();
            done();
        });
    });
    it('should join a channel as not operator', (done) => {
        client1 = new Client(config.port, config.ip);

        client1.on('connect', () => {
            client1.send('NICK test');
            client1.send('USER test 0 * :test');
        });

        client1.on('auth', () => {
             client1.send('JOIN #test');
        });

        client1.on('rpl_namreply', (message) => {
            if(message.indexOf('@test') > 0) {
                var client2 = new Client(config.port, config.ip);

                client2.on('connect', () => {
                    client2.send('NICK test2');
                    client2.send('USER test2 0 * :test2');
                });

                client2.on('auth', () => {
                    client2.send('JOIN #test');
                });

                client2.on('rpl_namreply', (message) => {
                    message.should.containEql('@test test2');
                    client1.close();
                    client2.close();
                    done();
                });
            }
        });


    });
});