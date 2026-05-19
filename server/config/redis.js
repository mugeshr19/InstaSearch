const redis = require("redis");

const redisClient = redis.createClient();

redisClient.on("error", (err) => {
    console.log("Redis Error:", err);
});

(async () => {

    await redisClient.connect();

    console.log("Redis Connected");

})();

module.exports = redisClient;