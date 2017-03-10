let MongoClient = require('mongodb').MongoClient;
let config = require('./../../ENV.json');
import Redis from './RedisInterface';
import Channel from './../channel/Channel';
import Trigger from './Trigger';
let url = 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db;

module.exports = function (callback) {
    Trigger.setCallback(callback);
    MongoClient.connect(url, (err, db) => {
        db.collection('users').find().toArray((err, us) => {
            us.forEach((user) => {
                Redis.setUser(user.data);
            });
            Trigger.update();
        });
        db.collection('channels').find().toArray((err, cs) => {
            cs.forEach((channel) => {
                let obj = JSON.parse(channel.data);
                let chan = new Channel({identity: obj.creator}, obj.name, obj.pass, parseInt(obj.size), (obj.topic || ''));
                chan.userFlags = obj.userflags;
                chan.flags = obj.flags;
                chan.bannedUsers = obj.bannedUsers;
                chan.invitations = obj.invitations;
            });
            Trigger.update();
        });
    });
};
