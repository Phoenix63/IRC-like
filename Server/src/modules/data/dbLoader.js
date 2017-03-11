import config from './../../ENV.json';
import Redis from './RedisInterface';
import Channel from './../channel/Channel';
import Trigger from './Trigger';
let MongoClient = require('mongodb').MongoClient;
let url;
//For unitTest we use an other DB and we drop it before starting
if(process.argv[2] === 'TEST'){
    url = 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.dbtest;
}else{
    url = 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db;
}

module.exports = function (callback) {
    Trigger.setCallback(callback);
    MongoClient.connect(url, (err, db) => {
        if(process.argv[2] === 'TEST'){
            db.dropDatabase();
        }
        db.collection('users').find().toArray((err, us) => {
            us.forEach((user) => {
                Redis.setUser(JSON.parse(user.data));
            });
            Trigger.update();
        });
        db.collection('channels').find().toArray((err, cs) => {
            cs.forEach((channel) => {
                let obj = JSON.parse(channel.data);
                let chan = new Channel({identity: obj.creator}, obj.name, obj.pass, parseInt(obj.size), (obj.topic || ''));
                chan.usersFlags = obj.usersFlags;
                chan.flags = obj.flags;
                chan.bannedUsers = obj.bannedUsers;
                chan.invitations = obj.invitations;
            });
            Trigger.update();
        });
    });
};
