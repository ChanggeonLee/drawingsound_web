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

router.get('/signout', async(req, res, next) => {

  firebase.auth().signOut().then(function() {
    req.flash('success', 'Successfully signed out');
  }).catch(function(error) {
    // An error happened.
  });
  
  res.redirect('/');
});


// test
router.get('/list', function(req, res, next){
  // var database = firebase.database();    
  return firebase.database().ref('/sheets').once('value').then(function(snapshot) {
    var username = (snapshot.val()) || 'Anonymous';
    res.send(username);
  });
});


// test
router.get('/test', function(req, res, next){
  var user = firebase.auth().currentUser;
  var uid = user.uid;
  var url = '/sheets/' + uid + '/' + '/-Ler0KtGWZtdi1O0J6sm' + '/';  
  return firebase.database().ref(url).once('value').then(function(snapshot) {
    var sheet = (snapshot.val());
    console.log(sheet);
    // res.render('test',{Sheet:sheet});
    // var str = ;
    res.render('test', {Sheet:sheet});    
  });  
  // var sheetdata = {
  //   str : 'X:1\nT: Cooley\'s\nM: 4/4\nL: 1/8\nR: reel\nK: Emin\nD2|:"Em"EB{c}BA B2 EB|~B2 AB dBAG|"D"FDAD BDAD|FDAD dAFD|\n"Em"EBBA B2 EB|B2 AB defg|"D"afe^c dBAF|1"Em"DEFD E2 D2:|2"Em"DEFD E2 gf||\n|:"Em"eB B2 efge|eB B2 gedB|"D"A2 FA DAFA|A2 FA defg|\n"Em"eB B2 eBgB|eB B2 defg|"D"afe^c dBAF|1"Em"DEFD E2 gf:|2"Em"DEFD E4|]\n'
  // };
  // res.render('test', {Sheet:sheetdata});
});


module.exports = router;