
function redisPort() {
    return parseInt(process.env.REDIS_PORT);
}

exports.redisPort = redisPort;