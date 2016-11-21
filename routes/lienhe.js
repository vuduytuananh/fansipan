var express = require('express');
var router = express.Router();

/* GET gioi thieu page. */
router.get('/', function(req, res, next) {
  res.render('lienhe');
});

module.exports = router;
