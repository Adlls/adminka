var express = require('express');
const app = express();
var router = express.Router();
var users = require('../controllers/users');
var user  = users.getUserDoc();
const jwt = require('jsonwebtoken');


let isAuth = async (req, res, next) => {
  //req.headers['From-Middleware'] = 1;

  const cookies = req.headers;
  const payload = jwt.verify(cookies.user, 'privateKey');
  const id = payload.id;
  const refrashToken = cookies.token;
  let userFound;
  const userDocs =  await user.getById(id);
  for (let i in userDocs) {
    if (userDocs[i]["_id"] + "" == id) {
      userFound = userDocs[i];
      break;
    }
  }
  if (userFound["token"] != refrashToken) res.status(403).send("denied access");
  else
    next();
};

let isAdmin = async (req, res, next) => {
  const cookies = req.cookies;
  const payload = jwt.verify(cookies.user, 'privateKey');
  const id = payload.id;
  const refrashToken = cookies.token;
  let userFound;
  const userDocs =  await user.getById(id);
  for (let i in userDocs) {
    if (userDocs[i]["_id"] + "" == id) {
      userFound = userDocs[i];
      break;
    }
  }
  if (userFound["role"] !== 'admin') res.status(403).send("denied access");
  else
    next();
}

router.use(isAuth);

//find all
router.get('/', async (req, res, next) => {
  let userDocs = await user.getAll();
  res.send(userDocs);
});


//find by id
router.get('/:id', async (req, res, next) => {
  await user.getById(req.params["id"]).then((value) => {
    console.log(value);
    res.send(value);
  });
});

//delete by id
router.delete('/:id', isAdmin, async (req, res, next) => {
  await user.remove(req.params["id"]).then((value) => {
    console.log(value);
    res.send(value);
  });
});

//add
router.post('/', isAdmin, async (req, res, next) => {
  let body = req.body;
  let insertDataset = {
    name: body.name,
    login: body.login,
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
router.put('/:id', isAdmin, async (req, res, next) => {
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


