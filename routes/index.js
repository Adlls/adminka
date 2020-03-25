var express = require('express');
var router = express.Router();
var users = require('../controllers/users');
/* GET home page. */
/*
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/
router.get('/api/users', (req, res, next) => {
  var user  = new users();
  return res.send(user.getAll());
});

module.exports = router;


