var express = require('express');
var router = express.Router();
const firebase = require('firebase');
const config = require('./lib/firebase_config');

firebase.initializeApp(config);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/signin', async(req, res, next) => {
  req.flash('success', '로그인 성공~!');    
  // req.flash('success', 'This is a flash message using the express-flash module.');

  // a = await firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {  
  //   var errorCode = error.code;
  //   var errorMessage = error.message;  
  // });

  // console.log(a);

  // console.log(req.body);    
  res.redirect('/home');
});

router.get('/list', function(req, res, next){
  // var database = firebase.database();    
  return firebase.database().ref('/sheets').once('value').then(function(snapshot) {
    var username = (snapshot.val()) || 'Anonymous';
    res.send(username);
  });
});



module.exports = router;
