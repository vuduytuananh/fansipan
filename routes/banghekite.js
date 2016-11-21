var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('ban-ghe-kite');
});

module.exports = router;
