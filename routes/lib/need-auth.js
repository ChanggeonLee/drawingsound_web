// 로그인을 확인 할수 있는 모듈
var firebase = require('firebase');
const config = require('./firebase_config');

// firebase.initializeApp(config);

module.exports = function needAuth(req, res, next) {
  var user = firebase.auth().currentUser;
  if (user) {
    // User is signed in.
    next();
  } else {
    // No user is signed in.
    req.flash('danger', '로그인해주세요');
    res.redirect('/');
  }
}