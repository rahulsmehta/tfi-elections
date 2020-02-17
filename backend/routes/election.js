const express = require('express');
const redis = require('redis');
const uuid = require('uuid/v4');
const { promisify } = require('util');
const utils = require('../utils');
const md5 = require('md5');


const router = express.Router();

const KEY = 'ELECTION';

const client = redis.createClient(utils.redisPort());
const hsetp = promisify(client.hset).bind(client);
const hgetp = promisify(client.hget).bind(client);
const hgetallp = promisify(client.hgetall).bind(client);

const stopRoundAsync = async (req, res) => {
    const electionId = req.param('electionId', null);
    const election = JSON.parse(await hgetp(KEY, electionId));
    const currentCandidates = election.currentCandidates;

    const voteKey = `${election.id}_${election.round}`;
    const rawVoteMap = await hgetallp(voteKey)
    const votes = Object.values(rawVoteMap);

    // process voteMap to determine next round - all candidates < 10% are dropped,
    // and if all have >= 10%, then candidate with fewest votes is dropped
    const nVotes = votes.length;
    const voteMap = votes.reduce( (acc, o) => (acc[o] = (acc[o] || 0)+1, acc), {} );

    const votePct = {}
    Object.keys(voteMap).forEach((candidate) => {
        votePct[candidate] = voteMap[candidate]/nVotes;
    });
    let remainingCandidates = Object.keys(voteMap).filter((candidate) => {
        return votePct[candidate] >= 0.1;
    });
    if (remainingCandidates.length == currentCandidates.length) {
        const sortedCandidates = Object.keys(voteMap).sort((a, b) => {
            return voteMap[b] - voteMap[a];
        });
        remainingCandidates = sortedCandidates.slice(0, sortedCandidates.length-1);
    }

    election.currentCandidates = remainingCandidates;
    if (remainingCandidates.length == 1) {
        election.state = 'completed';
    } else {
        election.state = 'closed';
    }

    const resp = await hsetp(KEY, electionId, JSON.stringify(election));

    res.send(JSON.stringify({ resp }));
};


router.get('/verify', function(req, res, next) {
    const hash =  md5(stopRoundAsync);
    res.send(hash);
});

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
    const electionId = req.param('electionId', null);
    const election = JSON.parse(await hgetp(KEY, electionId));
    election.state = 'active';
    election.round += 1;
    const result = await hsetp(KEY, electionId, JSON.stringify(election));
    res.send(JSON.stringify({ result }));
});

router.post('/:electionId/stop-round', stopRoundAsync);

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
