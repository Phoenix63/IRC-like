var should = require('should');
var Client = require('./core/Client');
var config = require('./core/config.json');

describe("command INVITE:", () => {
    var client, client1;
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
            client.send('NICK test');
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

    /*
     it('should say err_chanoprivneeded', (done) => {
     client = new Client(config.port, config.ip);
     client.on('connect', () => {
     client.send('NICK roger');
     client.send('USER roger 0 * :roger');

     });
     client.on('auth', () => {
     client.send('JOIN #chan');
     });


     client1 = new Client(config.port, config.ip);
     client1.on('connect', () => {
     client1.send('NICK michel')
     client1.send('USER michel 0 * :michel');
     });
     client1.on('auth', () => {
     client1.send('JOIN #chan');
     client.send('MODE #chan +i');
     client.send('INVITE michel #chan')
     client.on('err_chanoprivneeded', () => {
     client1.close();
     client.close();
     done();
     });
     });


     });*/

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