
let MongoClient = require('mongodb').MongoClient;
let config = require('./../../ENV.json');

import Redis from './RedisInterface';
let redis = Redis.instance;

import Caller from './Caller';
import Channel from './../channel/Channel';

var url = 'mongodb://'+config.mongo.user+':'+config.mongo.pass+'@'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db+config.mongo.method;

module.exports = function(callback) {

    if(process.argv[2] !== 'TEST') {
        MongoClient.connect(url, (err, db) => {

            let caller = new Caller(() => {
                db.close();
                callback();
            });

            let users = db.collection('users');
            users.find().toArray((err, us) => {

                let admin = db.collection('admin');
                admin.find().toArray((err, ads) => {

                    let channels = db.collection('channels');
                    channels.find().toArray((err, cs) => {
                        caller.toSave = (ads.length?ads.length:0) + (us.length?us.length:0) + (cs.length?cs.length:0);
                        us.forEach((user) => {
                            redis.addUser(user.identity, user.pass);
                            caller.incSaved();
                        });

                        ads.forEach((tuple) => {
                            redis.setAdmin({identity: tuple.name, role: tuple.role});
                            caller.incSaved();
                        });

                        cs.forEach((channel) => {
                            let obj = JSON.parse(channel.data);
                            let chan = new Channel({identity: obj.creator}, obj.name, obj.pass, parseInt(obj.size), (obj.topic||''));
                            chan.setUserFlags(obj.userflags);
                            caller.incSaved();
                        });
                    });
                });
            });


        });
    } else {
        callback();
    }

};