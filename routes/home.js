var express = require('express');
var router = express.Router();
var needauth = require('./lib/need-auth');
var firebase = require('firebase');

/* GET home page. */
router.get('/', needauth, (req, res, next) => {
  var user = firebase.auth().currentUser;
  var uid = user.uid;

  return firebase.database().ref('/sheets/'+uid).once('value').then(function(snapshot) {
    console.log(uid);
    var sheets = snapshot.val();    
    console.log(sheets);
    res.render('home',{Sheets:sheets});  
  });
});


module.exports = router;