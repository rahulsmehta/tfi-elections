
function redisPort() {
    return parseInt(process.env.REDIS_URL);
}

exports.redisPort = redisPort;