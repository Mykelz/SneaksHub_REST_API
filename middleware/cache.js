const redis = require('redis');

let redisClient;

module.exports = async (req, res, next) => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();

  next()
};

