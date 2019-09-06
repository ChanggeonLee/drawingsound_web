var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var needauth = require('./lib/need-auth');
var asyncerror = require('./lib/async-error');
// const catchErrors = require('../lib/async-error');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/show',needauth ,asyncerror( async(req, res, next) => {
  var user = firebase.auth().currentUser;
  var uid = user.uid;

  return firebase.database().ref('/users/'+uid).once('value').then(function(snapshot) {
    console.log(uid);
    var username = snapshot.val();    
    console.log(username);
    res.render('users/show',{User:username});  
  });
}));

router.get('/signup', function(req, res, next) {
  res.render('users/signup', { title: 'Express' });
});
  
router.post('/', function(req, res, next) {
/*
  var err = validateForm(req.body, {needPassword: true});
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
  var user = await User.findOne({email: req.body.email});
  console.log('USER???', user);
  if (user) {
    req.flash('danger', 'Email address already exists.');
    return res.redirect('back');
  }
  user = new User({
    name: req.body.name,
    email: req.body.email,
  });
  user.password = await user.generateHash(req.body.password);
  await user.save();
  req.flash('success', 'Registered successfully. Please sign in.');

*/
  res.redirect('/');
});

module.exports = router;
