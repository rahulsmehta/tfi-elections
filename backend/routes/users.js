var express = require('express');
var uuid = require('uuid/v4');
var router = express.Router();
const redis = require('redis');
const utils = require('../utils');
const { promisify } = require('util');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const client = redis.createClient(utils.redisPort());
const hsetp = promisify(client.hset).bind(client);
const hgetp = promisify(client.hget).bind(client);
const hgetallp = promisify(client.hgetall).bind(client);

const KEY = "USERS"

// console.log(process.env.SENDGRID_API_KEY);
// const msg = {
//   to: 'mehta.rahul95@gmail.com',
//   from: 'test@example.com',
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// };
// sgMail.send(msg).catch((msg) => console.error(msg));

function buildEmail(to, link) {
  const html = `Please visit <a href="${link}">${link}</a> to vote.`
  const msg = {
    to,
    from: 'lucassm@princeton.edu',
    subject: 'TFI 2019 Elections Link',
    text: "Welcome to TI Elections 2019.",
    html
  };
  return msg;
}

router.get('/:userId', async (req, res, next) => {
  const { userId } = req.params;
  if (userId == process.env.ADMIN_KEY) {
    const responseJson = { isAdmin: true, username: "admin" };
    res.send(JSON.stringify(responseJson));
  } else {
    const resp = await hgetp(KEY, userId);
    if (resp !== null) {
      const raw = JSON.parse(await hgetp(KEY, userId));
      const responseJson = { isAdmin: false, username: raw.netId }
      res.send(JSON.stringify(responseJson));
    } else {
      res.send(JSON.stringify({ isAdmin: false, username: undefined }));
    }
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
  // console.log(tuples);
  const mailDatas = tuples.map(t => buildEmail(t.email, t.link));
  console.log(mailDatas);
  sgMail.send(mailDatas).then(() => {
    res.send('{}');
  }).catch((e) => {
    console.error(e);
    res.send('{}');
  })
  
});


module.exports = router;
