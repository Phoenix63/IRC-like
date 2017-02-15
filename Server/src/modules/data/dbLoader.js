
let MongoClient = require('mongodb').MongoClient;
let config = require('./../../ENV.json');

import Redis from './RedisInterface';
let redis = Redis.instance;

import Caller from './Caller';

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

                caller.toSave = ads.length + us.length;

                ads.forEach((tuple) => {
                    redis.setAdmin({identity: tuple.name});
                    caller.incSaved();
                });
            });
        });


    });
};