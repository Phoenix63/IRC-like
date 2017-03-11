let redis = require('redis');
let config = require('./../../ENV.json');
let client;

class Redis {

    static init() {
        client = redis.createClient(6379, "localhost");
        client.on("error", function (err) {
            console.log("Error " + err);
        });
    }

    static flush() {
        client.flushdb(function (err, succeeded) {
            if(err){
                throw err;
            }
        });
    }

    static setChannel(channel) {
        client.hmset(
            "channels",
            channel.name,
            JSON.stringify({
                name: channel.name,
                creator: channel.creator,
                flags: channel.channelFlags,
                usersFlags: channel.getOnlyRegisteredUsersFlags(),
                bannedUsers: channel.bannedUsers,
                invitations: channel.getOnlyRegisteredUsersInvitations(),
                pass: channel.pass,
                size: channel.size,
                topic: (channel.topic || '')
            }));
    }

    static getChannels(callback) {
        client.hgetall("channels", (err, obj) => {
            callback(obj)
        });
    }

    static deleteChannel(channel) {
        client.hdel("channels", channel.name);
    }

    static setUser(user) {
        client.hmset(
            "users", user.id,
            JSON.stringify({
                id: user.id,
                pass: user.pass,
                flags: user.flags
            }));
    }

    static getUsers(callback) {
        client.hgetall("users", (err, obj) => {
            callback(obj);
        });
    }

    static getUser(id) {
        client.hgetall("users", (err, obj) => {
            if (err) {
            } else {
                if (obj && obj[id]) {
                    return JSON.parse(obj[i]);
                }
            }
            return null;
        });
    }

    static showDBRedis() {
        client.hgetall("users", (err, obj) => {
            console.log("----------------------------------------REDIS----------------------------------------");
            console.log("USERS :");
            for (let key in obj) {
                let tmp = JSON.parse(obj[key]);
                for (let key2 in tmp) {
                    console.log("\t" + key2 + ":" + tmp[key2]);
                }
                console.log("\n");
            }
        });
        client.hgetall("channels", (err, obj) => {
            console.log("Channels :");
            for (let key in obj) {
                let args = JSON.parse(obj[key]);
                for (let key2 in args) {
                    if(key2 == "usersFlags"){
                        console.log("\tUsers Flags :");
                        for(let k in args[key2]){
                            console.log("\t\t"+k+":"+args[key2][k]);
                        }
                    }else{
                        console.log("\t" + key2 + ":" + args[key2]);
                    }
                }
                console.log("\n");
            }
        });
    }

    static quit() {
        Redis.flush();
        client.quit();
    }
}

export default Redis;


