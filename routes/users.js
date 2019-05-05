var express = require('express');
var router = express.Router();
//const catchErrors = require('../lib/async-error');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/show', function(req, res, next) {
  res.render('users/show');
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
