let redis = require('redis');
let config = require('./../../ENV.json');
let debug = require('debug')('server:redis');
let client;

class Redis {

    static init() {
        client = redis.createClient({host: config.redis.host, port:config.redis.port});
        client.on("error", function (err) {
            debug("Error " + err);
        });
    }

    static flush() {
        client.flushdb(function (err, succeeded) {
            if (err) {
                throw err;
            }
        });
    }

    static setBannedIP(bannedIP) {
        //client.hmset("bans",);
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
                bannedIP: channel.bannedIP,
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
            "users", user.identity,
            JSON.stringify({
                identity: user.identity,
                pass: user.pass,
                flags: user.flags
            }));
    }

    static getUsers(callback) {
        client.hgetall("users", (err, obj) => {
            callback(obj);
        });
    }

    static quit() {
        Redis.flush();
        client.quit();
    }
}

export default Redis;


