const express = require('express');
const redis = require('redis');
const uuid = require('uuid/v4');
const { promisify } = require('util');
const utils = require('../utils');


const router = express.Router();

const KEY = 'ELECTION';

const client = redis.createClient(utils.redisPort());
const hsetp = promisify(client.hset).bind(client);
const hgetp = promisify(client.hget).bind(client);

/* GET users listing. */

router.post('/create', function(req, res, next) {
    const { position, icon, candidates, adminToken } = req.body;
    if (process.env.ADMIN_KEY !== adminToken) {
        res.sendStatus(403);
        return;
    }
    const candidatesList = candidates.split('\n');

    const id = uuid();

    const payload = {
        id, position, icon, state: 'closed',
        startingCandidates: candidatesList,
        currentCandidates: candidatesList,
        round: 0
    };
    const responseCode = client.hset(KEY, id, JSON.stringify(payload));
    const responseBody = { id, responseCode }
    res.send(JSON.stringify(responseBody));
});

router.get('/all', (req, res) => {
    client.hgetall(KEY, (err, reply) => {
        if (err) { res.send(500); }
        if (!reply) {
            res.send(JSON.stringify([]));
        } else {
            res.send(JSON.stringify(Object.values(reply).reverse()));
        }
    });
});

router.get('/:electionId', (req, res, next) => {
    const id = req.param('electionId', null);
    if (!id) {
        console.error("Invalid election id");
        res.send(500);
    }
    client.hget(KEY, id, (err, reply) => {
        if (err) { res.send(500); }
        res.send(reply);
    });
});

router.post('/:electionId/start-round', async (req,res) => {
    // const { adminToken } = req.body;
    // if (process.env.ADMIN_KEY !== adminToken) {
    //     res.sendStatus(403);
    //     return;
    // }
    const electionId = req.param('electionId', null);
    const election = JSON.parse(await hgetp(KEY, electionId));
    election.state = 'active';
    election.round += 1;
    const result = await hsetp(KEY, electionId, JSON.stringify(election));
    res.send(JSON.stringify({ result }));
});

router.post('/:electionId/delete', (req, res, next) => {
    const id = req.param('electionId', null);
    if (!id) {
        console.error("Invalid election id");
        res.send(500);
    }
    client.hdel(KEY, [ id ] , (err, reply) => {
        if (err) { res.send(500); }
        res.send({ response: reply });
    });
});


module.exports = router;
