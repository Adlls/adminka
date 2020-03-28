var express = require('express');
var router = express.Router();
var users = require('../controllers/users');
var user  = new users();

/* GET home page. */
/*
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/

//find all
router.get('/api/users/', async (req, res, next) => {
     await user.getAll().then((value) => {
       console.log(value);
       res.send(value);
     });
});


//find by id
router.get('/api/users/:id', async (req, res, next) => {
  await user.getById(req.params["id"]).then((value) => {
      console.log(value);
      res.send(value);
    });
});

//delete by id
router.delete('/api/users/:id', async (req, res, next) => {
  await user.remove(req.params["id"]).then((value) => {
    console.log(value);
    res.send(value);
  });
});

//add
router.post('/api/users', async (req, res, next) => {
  let body = req.body;
  let insertDataset = {
    name: body.name,
    pass: body.pass,
    email: body.email,
    phone: body.phone,
    role: body.role
  };
  await user.create(insertDataset).then((value) => {
     console.log(value);
  });
  res.send(insertDataset);
});

//update
router.put('/api/users/:id', async (req, res, next) => {
  let body = req.body;
  let updateDataset = {
    name: body.name,
    pass: body.pass,
    email: body.email,
    phone: body.phone,
    role: body.role
  };
   await user.update(req.params["id"], updateDataset).then( (value) => {
      console.log(value);
      res.send(value);
  });
});




module.exports = router;


