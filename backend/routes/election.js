const express = require('express');
const redis = require('redis');
const uuid = require('uuid/v4');
const utils = require('../utils');


const router = express.Router();

const KEY = 'ELECTION';

const client = redis.createClient(utils.redisPort());

/* GET users listing. */

router.post('/create', function(req, res, next) {
    const { position, icon, candidates } = req.body;
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

router.get('/:electionId', (req, res, next) => {
    const id = req.param('electionId', null);
    if (!id) {
        console.error("Invalid election id");
        res.send(500);
    }
    client.hget(KEY, id, (err, reply) => {
        if (err) {
            res.send(500);
        }
        res.send(reply);
    });
});

router.post('/:electionId/delete', (req, res, next) => {
    const id = req.param('electionId', null);
    if (!id) {
        console.error("Invalid election id");
        res.send(500);
    }
    console.log(id);
    res.send(JSON.stringify({}));
});


module.exports = router;
