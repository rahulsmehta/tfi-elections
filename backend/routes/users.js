var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:userId', function(req, res, next) {
  if (req.params.userId == 'awefo9') {
    const responseJson = { isAdmin: true, username: "rahulm" };
    res.send(JSON.stringify(responseJson));
  }
  const responseJson = { isAdmin: false, username: "rahulmehta" };
  res.send(JSON.stringify(responseJson));
});

module.exports = router;
