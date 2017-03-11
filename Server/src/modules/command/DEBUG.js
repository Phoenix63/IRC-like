"use strict";

let MongoClient = require('mongodb').MongoClient;
import Redis from './../data/RedisInterface';
import config from './../../ENV.json';
let url = 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db;
import dbSaver from "../data/dbSaver";
import dbLoader from "../data/dbLoader";

module.exports = function (socket, command) {
    if(process.argv[2] === 'PROD'){
        return;
    }
    //view redis
    if(command[1].indexOf("--vr") > -1){
        Redis.getUsers((users)=>{
            console.log("----------------------------------------REDIS----------------------------------------");
            console.log("USERS :");
            for (let key in users) {
                if(!users.hasOwnProperty(key)) continue;
                let tmp = JSON.parse(users[key]);
                for (let key2 in tmp) {
                    if(!tmp.hasOwnProperty(key2)) continue;
                    console.log("\t" + key2 + ":" + tmp[key2]);
                }
                console.log("\n");
            }
        });
        Redis.getChannels((channels)=>{
            console.log("Channels :");
            for (let key in channels) {
                if(!channels.hasOwnProperty(key)) continue;
                let tmp = JSON.parse(channels[key]);
                for (let key2 in tmp) {
                    if(!tmp.hasOwnProperty(key2)) continue;
                    if(key2 == "usersFlags"){
                        console.log("\tUsers Flags : ");
                        for(let k in (tmp[key2])){
                            if(!tmp[key2].hasOwnProperty(k)) continue;
                            console.log("\t\t"+k+":"+tmp[key2][k]);
                        }
                    }else{
                        console.log("\t" + key2 + ":" + tmp[key2]);
                    }
                }
                console.log("\n");
            }
        });
    }
    //view mongo
    if(command[1].indexOf("--vm") > -1){
        MongoClient.connect(url, (err, db) => {
            db.collection('users').find().toArray((err, us) => {
                console.log("----------------------------------------MONGO----------------------------------------");
                console.log("USERS :");
                us.forEach((user) => {
                    let obj = JSON.parse(user.data);
                    for(let key in obj){
                        if(!obj.hasOwnProperty(key)) continue;
                        console.log("\t"+key+":"+obj[key]);
                    }
                    console.log("\n");
                });
            });
            db.collection('channels').find().toArray((err, ch) => {
                console.log("Channels :");
                ch.forEach((channel) => {
                    let obj = JSON.parse(channel.data);
                    for(let key in obj){
                        if(!obj.hasOwnProperty(key)) continue;
                        if(key == "usersFlags"){
                            console.log("\tUsers Flags :");
                            for(let k in obj[key]){
                                if(!obj[key].hasOwnProperty(k)) continue;
                                console.log("\t\t"+k+":"+obj[key][k]);
                            }
                        }else{
                            console.log("\t"+key+":"+obj[key]);
                        }
                    }
                    console.log("\n");
                });
            });
        });

    }
    if(command[1].indexOf("--loadOnMongo") >-1){
        dbSaver(()=>{
            console.log("Transfert redis to mongo");
        });
    }
    if(command[1].indexOf("--loadOnRedis") >-1){
        dbLoader(()=>{
            console.log("Transfert mongo to redis");
        });
    }
    if(command[1].indexOf("--dr") >-1){
        Redis.flush();
        console.log("Redis has been deleted");
    }
    if(command[1].indexOf("--dm") >-1){
        MongoClient.connect(url, (err, db) => {
            db.dropDatabase();
        });
        console.log("Mongo has been deleted");
    }
};
