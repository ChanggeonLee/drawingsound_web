var express = require('express');
var router = express.Router();
const firebase = require('firebase');
const config = require('./lib/firebase_config');

firebase.initializeApp(config);



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/list', function(req, res, next){
  // var database = firebase.database();
  return firebase.database().ref('/sheets').once('value').then(function(snapshot) {
    var username = (snapshot.val()) || 'Anonymous';
    res.send(username);
  });
});



module.exports = router;
