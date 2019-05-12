var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', );
});

router.get('/show', function(req, res, next) {
  res.render('sheet/show', );
});

module.exports = router;
