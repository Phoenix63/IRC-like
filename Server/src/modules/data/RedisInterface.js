
let redisLib = require('redis');
let conf = require('./../../ENV.json');

let instance;

class Redis {

    /**
     *
     * @param {Redis.client} client
     * @constructor
     */
    constructor(client) {

        this._client = client;
        this._client.auth(conf.redis.pass);

        this._client.on("error", function(err) {
            console.log(err);
        });
    }

    /**
     *
     * @returns {Redis}
     * @static
     */
    static get instance() {
        if(!instance) {
            instance = new Redis(redisLib.createClient({host: conf.redis.host, port:conf.redis.port}));
        }
        return instance;
    }

    get client() {
        return this._client;
    }

    /**
     * set a non guest client server admin
     * @param {Client} client
     */
    setAdmin(client) {
        if(client.identity.indexOf("GUEST_") === 0) {
            throw "cannot set guest admin";
        } else {
            this._client.set("admin", client.identity, redisLib.print);
        }
    }

    /**
     * get admin if not error
     * @param {function(reply)} callback
     */
    getAdmin(callback=function(reply){}) {
        this._client.get("admin", (err,reply) => {
            if(err) {
                throw err;
            } else {
                callback(reply);
            }
        });
    }

    /**
     *
     * @param {Client.identity} identity
     * @param {function(err, reply)} callback
     */
    getPass(identity, callback=function(err, reply){}) {
        this._client.hgetall("PASS",(err, obj) => {
            if(obj && obj[identity]) {
                callback(null, obj[identity]);
            } else {
                callback("no pass set", null);
            }
        });
    }

    setPass(identity, pass) {
        this._client.hmset("PASS", identity, pass);
    }
}

export default Redis;


