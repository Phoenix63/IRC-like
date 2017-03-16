import config from './../../ENV.json';
import Redis from './RedisInterface';
import Channel from './../channel/Channel';
import Trigger from './Trigger';
let MongoClient = require('mongodb').MongoClient;
let url;
//For unitTest we use an other DB and we drop it before starting
if (process.env.RUNNING === 'TEST') {
    url = 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.dbtest;
} else {
    url = 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db;
}

module.exports = function (callback) {
    MongoClient.connect(url, (err, db) => {

        let trigger = new Trigger(callback, 2);

        if (process.env.RUNNING === 'TEST') {
            db.dropDatabase();
        }

        db.collection('users').find().toArray(function (err, us) {
            if (us.length > 0) {
                trigger.addAsyncTask(us.length);
                trigger.removeAsyncTask(1);
                us.forEach(function (user) {
                    Redis.setUser(JSON.parse(user.data));
                    trigger.perform();
                });
            } else {
                trigger.removeAsyncTask(1)
            }
        });
        db.collection('channels').find().toArray(function (err, cs) {
            if (cs.length > 0) {
                trigger.addAsyncTask(cs.length);
                trigger.removeAsyncTask(1);
                cs.forEach(function (channel) {
                    let obj = JSON.parse(channel.data);
                    let chan = new Channel({identity: obj.creator}, obj.name, obj.pass, parseInt(obj.size), obj.topic);
                    chan.usersFlags = obj.usersFlags;
                    chan.flags = obj.flags;
                    chan.bannedIP = obj.bannedIP;
                    trigger.perform();
                });
            } else {
                trigger.removeAsyncTask(1)
            }
        });
    });
};
