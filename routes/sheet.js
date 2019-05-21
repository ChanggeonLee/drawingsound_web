var express = require('express');
var router = express.Router();
var needauth = require('./lib/need-auth');
var firebase = require('firebase');
var catcherror = require('./lib/async-error');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', );
});

router.get('/show', needauth, function(req, res, next) {
  var user = firebase.auth().currentUser;
  var uid = user.uid;
  var key = req.query.key;
  var url = '/sheets/' + uid + '/' + req.query.key + '/';  
  return firebase.database().ref(url).once('value').then(function(snapshot) {
    var sheet = (snapshot.val());
    res.render('sheet/show', {Sheet:sheet, Key:key});
  });  
});

router.get('/msheet',function(req,res,next) {
  console.log(req.query.uid);
  console.log(req.query.key);
  var url = '/sheets/' + req.query.uid + '/' + req.query.key + '/'; 
  return firebase.database().ref(url).once('value').then(function(snapshot) {
    var sheet = (snapshot.val());
    res.render('sheet/mobile', {Sheet:sheet});
  });
});

router.delete('/delete/:key/',needauth,catcherror( async(req,res,next) => {
  var user = firebase.auth().currentUser;
  uid = user.uid;
  console.log(req.params.key);
  // var url = '/sheets/' + uid + '/' + req.body.key + '/'; 
  // firebase.database().ref(url).remove();
  firebase.database().ref().child('sheets').child(uid).child(req.params.key).remove();
  req.flash('danger', "악보 삭제 완료");
  res.redirect('/home');
}));

module.exports = router;