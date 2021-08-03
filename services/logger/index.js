const redis = require("redis");
const settings = require("./settings");

module.exports = redis.createClient(settings);
