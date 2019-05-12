var express = require('express');
var router = express.Router();
var needauth = require('./lib/need-auth');
var firebase = require('firebase');

/* GET home page. */
router.get('/', needauth, (req, res, next) => {
  var user = firebase.auth().currentUser;
  var uid = user.uid;

  return firebase.database().ref('/sheets/'+uid).once('value').then(function(snapshot) {
    var returnArr = [];
    snapshot.forEach(function(childSnapshot) {
      var item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
    });
    
    res.render('home',{Sheets:returnArr});  
  });
});


module.exports = router;