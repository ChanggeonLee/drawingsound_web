var express = require('express');
var router = express.Router();
var needauth = require('./lib/need-auth');
var firebase = require('firebase');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', );
});

router.get('/show', needauth, function(req, res, next) {
  var user = firebase.auth().currentUser;
  var uid = user.uid;
  var url = '/sheets/' + uid + '/' + req.query.key + '/';  
  return firebase.database().ref(url).once('value').then(function(snapshot) {
    var sheet = (snapshot.val());
    res.render('sheet/show', {Sheet:sheet});
  });  
});

router.get('/test', function(req, res, next) {
  var url = '/sheets/' + req.query.uid + '/' + req.query.key + '/';  
  console.log(req.query.key);
  return firebase.database().ref(url).once('value').then(function(snapshot) {
    var sheet = (snapshot.val());
    res.render('sheet/show', {Sheet:sheet});
  });  
});

router.get('/msheet',function(req,res,next) {
  console.log(req.query.uid);
  console.log(req.query.key);
  return firebase.database().ref(url).once('value').then(function(snapshot) {
    var sheet = (snapshot.val());
    res.render('sheet/mobile', {Sheet:sheet});
  });
});

module.exports = router;
