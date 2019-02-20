
function redisPort() {
    return process.env.REDIS_URL;
}

exports.redisPort = redisPort;