const express = require('express');
const app = express();
const router = express.Router();
const users = require('../controllers/users');
const user  = users.getUserDoc();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const jsonParser = express.json();
const request = require('request');
const http = require('http');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


router.get('/', jsonParser, async (req, res) => {

    const cookies = req.cookies;
    const payload = jwt.verify(cookies.user, 'privateKey');
    const id = payload.id;
    const refrashToken = cookies.token;
    const userDocs =  await user.getById(id);
    let userFound;
    let isAdmin;

   for (let i in userDocs) {
       if (userDocs[i]["_id"] + "" === id) {
           userFound = userDocs[i];
           break;
       }
   }
   if (!userFound) res.status(403).redirect(`../auth`);


    if (userFound["role"] === "admin") isAdmin = true;

    if (userFound["token"] !== refrashToken) {
       res.status(403).redirect(`../auth`);
   }

    res.render('admin-panel', {
        name: userFound["name"],
        role: userFound["role"],
        phone: userFound["phone"],
        users: req.query.users,
        isAdmin: isAdmin
    })
});

module.exports = router;