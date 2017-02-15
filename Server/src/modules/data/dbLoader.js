
let MongoClient = require('mongodb').MongoClient;
let config = require('./../../ENV.json');

import Redis from './RedisInterface';
let redis = Redis.instance;

import Caller from './Caller';
import Channel from './../channel/Channel';

var url = 'mongodb://'+config.mongo.user+':'+config.mongo.pass+'@'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db+config.mongo.method;

module.exports = function(callback) {


    MongoClient.connect(url, (err, db) => {

        let caller = new Caller(() => {
            db.close();
            callback();
        });

        let users = db.collection('users');
        users.find().toArray((err, us) => {
             us.forEach((user) => {
                 redis.addUser(user.identity, user.pass);
                 caller.incSaved();
             });

            let admin = db.collection('admin');
            admin.find().toArray((err, ads) => {



                ads.forEach((tuple) => {
                    redis.setAdmin({identity: tuple.name});
                    caller.incSaved();
                });

                let channels = db.collection('channels');
                channels.find().toArray((err, cs) => {
                    caller.toSave = ads.length + us.length + cs.length;

                    cs.forEach((channel) => {
                        let obj = JSON.parse(channel.data);
                        let chan = new Channel({identity: obj.creator}, obj.name, obj.pass, parseInt(obj.size));
                        chan.setUserFlags(obj.userflags);
                        caller.incSaved();
                    });
                });
            });
        });


    });
};