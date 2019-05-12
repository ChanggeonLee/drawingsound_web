var express = require('express');
var router = express.Router();
const firebase = require('firebase');
const config = require('./lib/firebase_config');

firebase.initializeApp(config);

router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/signin', async(req, res, next) => {
  email = req.body.email;
  password = req.body.password;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(firebaseUser){      
      req.user=firebaseUser;
      req.flash('success', "login 성공");    
      res.redirect('/home');
    })
    .catch(function(error) {  
      var errorCode = error.code;
      var errorMessage = error.message;  
      req.flash('danger', errorMessage);    
      res.redirect('/');
  });

});

// test
router.get('/list', function(req, res, next){
  // var database = firebase.database();    
  return firebase.database().ref('/sheets').once('value').then(function(snapshot) {
    var username = (snapshot.val()) || 'Anonymous';
    res.send(username);
  });
});

module.exports = router;