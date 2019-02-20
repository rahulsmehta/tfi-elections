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

const KEY = "USERS"

router.get('/:userId', async (req, res, next) => {
  const { userId } = req.params;
  if (userId == process.env.ADMIN_KEY) {
    const responseJson = { isAdmin: true, username: "admin" };
    res.send(JSON.stringify(responseJson));
  } else {
    const raw = JSON.parse(await hgetp(KEY, userId));
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
    return hsetp(KEY, value.id, JSON.stringify(value));
  }));
  const added = promises.reduce((p, c) => p + c);
  res.send(JSON.stringify({ added }));
});

router.post('/email', async (req, res) => {
  const { adminToken } = req.body;
  const baseUrl = `http://${req.get('Host')}`;
  if (process.env.ADMIN_KEY !== adminToken) {
      res.sendStatus(403);
      return;
  }

  const users = Object.values(await hgetallp(KEY)).map(v => JSON.parse(v));
  const tuples = users.map((user) => {
    return {
      email: user.email,
      link: `${baseUrl}/${user.id}`
    }
  });
  console.log(tuples);

  res.send("{}");

  // const profiles = ids.map((netId) => {
  //   return {
  //     netId,
  //     email: `${netId}@princeton.edu`,
  //     id: uuid()
  //   }
  // });
  // console.log(profiles);

  // const promises = await Promise.all(profiles.map((value) => {
  //   return hsetp(KEY, value.id, JSON.stringify(value));
  // }));
  // const added = promises.reduce((p, c) => p + c);
  // res.send(JSON.stringify({ added }));
});


module.exports = router;
