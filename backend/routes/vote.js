var express = require('express');
var uuid = require('uuid/v4');
var router = express.Router();
const redis = require('redis');
const utils = require('../utils');
const { promisify } = require('util');

const client = redis.createClient(utils.redisPort());
const hsetp = promisify(client.hset).bind(client);
const hgetp = promisify(client.hget).bind(client);
const hgetallp = promisify(client.hgetall).bind(client);


router.post('/:electionId/:round', async (req, res) => {
    const { candidate, userToken } = req.body;
    const { electionId, round } = req.params;
    const key = `${electionId}_${round}`;
    const result = await hsetp(key, userToken, candidate);
    res.send(JSON.stringify({ result }));
});

module.exports = router;
