var express = require('express');
var router = express.Router();

// var bodyParser

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('about');
});

module.exports = router;
