"use strict";
let debug = require('debug')('pandirc:debugdb');
let MongoClient = require('mongodb').MongoClient;
import Redis from './../data/RedisInterface';
import config from './../../ENV.json';
let url = 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db;
import dbSaver from "../data/dbSaver";
import dbLoader from "../data/dbLoader";

module.exports = function (socket, command) {
    if (process.env.RUNNING === 'PROD') {
        return;
    }
    //view redis
    if (command[1].indexOf("--vr") > -1) {
        Redis.getUsers((users) => {
            debug("----------------------------------------REDIS----------------------------------------");
            debug("USERS :");
            for (let key in users) {
                if (!users.hasOwnProperty(key)) continue;
                let tmp = JSON.parse(users[key]);
                for (let key2 in tmp) {
                    if (!tmp.hasOwnProperty(key2)) continue;
                    debug("\t" + key2 + ":" + tmp[key2]);
                }
                debug("\n");
            }
        });
        Redis.getChannels((channels) => {
            debug("Channels :");
            for (let key in channels) {
                if (!channels.hasOwnProperty(key)) continue;
                let tmp = JSON.parse(channels[key]);
                for (let key2 in tmp) {
                    if (!tmp.hasOwnProperty(key2)) continue;
                    if (key2 == "usersFlags") {
                        debug("\tUsers Flags : ");
                        for (let k in (tmp[key2])) {
                            if (!tmp[key2].hasOwnProperty(k)) continue;
                            debug("\t\t" + k + ":" + tmp[key2][k]);
                        }
                    } else {
                        debug("\t" + key2 + ":" + tmp[key2]);
                    }
                }
                debug("\n");
            }
        });
    }
    //view mongo
    if (command[1].indexOf("--vm") > -1) {
        MongoClient.connect(url, (err, db) => {
            db.collection('users').find().toArray((err, us) => {
                debug("----------------------------------------MONGO----------------------------------------");
                debug("USERS :");
                us.forEach((user) => {
                    let obj = JSON.parse(user.data);
                    for (let key in obj) {
                        if (!obj.hasOwnProperty(key)) continue;
                        debug("\t" + key + ":" + obj[key]);
                    }
                    debug("\n");
                });
            });
            db.collection('channels').find().toArray((err, ch) => {
                debug("Channels :");
                ch.forEach((channel) => {
                    let obj = JSON.parse(channel.data);
                    for (let key in obj) {
                        if (!obj.hasOwnProperty(key)) continue;
                        if (key == "usersFlags") {
                            debug("\tUsers Flags :");
                            for (let k in obj[key]) {
                                if (!obj[key].hasOwnProperty(k)) continue;
                                debug("\t\t" + k + ":" + obj[key][k]);
                            }
                        } else {
                            debug("\t" + key + ":" + obj[key]);
                        }
                    }
                    debug("\n");
                });
            });
        });

    }
    if (command[1].indexOf("--loadOnMongo") > -1) {
        dbSaver(() => {
            debug("Transfert redis to mongo");
        });
    }
    if (command[1].indexOf("--loadOnRedis") > -1) {
        dbLoader(() => {
            debug("Transfert mongo to redis");
        });
    }
    if (command[1].indexOf("--dr") > -1) {
        Redis.flush();
        debug("Redis has been deleted");
    }
    if (command[1].indexOf("--dm") > -1) {
        MongoClient.connect(url, (err, db) => {
            db.dropDatabase();
        });
        debug("Mongo has been deleted");
    }
};
