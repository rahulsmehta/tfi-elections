var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:userId', function(req, res, next) {
  if (req.params.userId == process.env.ADMIN_KEY) {
    const responseJson = { isAdmin: true, username: "admin" };
    res.send(JSON.stringify(responseJson));
  }
  const responseJson = { isAdmin: false, username: undefined };
  res.send(JSON.stringify(responseJson));
});

module.exports = router;
