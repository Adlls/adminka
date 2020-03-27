var express = require('express');
var router = express.Router();
var users = require('../controllers/users');
var user  = new users();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});

/* GET home page. */
/*
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/



//find all
router.get('/api/users/', async (req, res, next) => {
     await user.getAll().then((value) => {
       res.send(value);
     });
});


//find by id
router.get('/api/users/:id', async (req, res, next) => {
  await user.getById(req.params["id"]).then((value) => {
    res.send(value);
  });
});

//update
router.put('api/users/:id', (req, res, next) => {
  let newModel = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    role: req.body.role
  }
  return res.send(user.update(res.params.id, newModel));
});

router.post('/api/users', urlencodedParser, (req, res, next) => {

  return res.send(user.create(
      req.body.name,
      req.body.password,
      req.body.email,
      req.body.phone,
      req.body.role));


  /*
  return res.send(user.create(
      "req.body.name",
      "12345",
      "req.body.email",
      12345,
      "req.body.role"));
});
*/
});

router.delete('api/users/:id', (req, res, next) => {
  return res.send(users.remove(req.params.id));
});


module.exports = router;


