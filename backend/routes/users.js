var express = require('express');
var uuid = require('uuid/v4');
var router = express.Router();
const redis = require('redis');
const utils = require('../utils');
const { promisify } = require('util');

const client = redis.createClient(utils.redisPort());
const hseta = promisify(client.hset).bind(client);
const hgeta = promisify(client.hget).bind(client);

const KEY = "USERS"

router.get('/:userId', async (req, res, next) => {
  const { userId } = req.params;
  if (userId == process.env.ADMIN_KEY) {
    const responseJson = { isAdmin: true, username: "admin" };
    res.send(JSON.stringify(responseJson));
  } else {
    const raw = JSON.parse(await hgeta(KEY, userId));
    const responseJson = { isAdmin: false, username: raw.netId }
    res.send(JSON.stringify(responseJson));
  }
});

router.post('/add', async (req, res) => {
  const { ids, adminToken } = req.body;
  if (process.env.ADMIN_KEY !== adminToken) {
      res.sendStatus(403);
      return;
  }
  const profiles = ids.map((netId) => {
    return {
      netId,
      email: `${netId}@princeton.edu`,
      id: uuid()
    }
  });
  console.log(profiles);

  const promises = await Promise.all(profiles.map((value) => {
    return hseta(KEY, value.id, JSON.stringify(value));
  }));
  const added = promises.reduce((p, c) => p + c);
  res.send(JSON.stringify({ added }));
});

module.exports = router;
