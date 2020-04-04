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


 async function requestToApiUsers(req, res, userFound, url, method, listener) {
     await http.request({
         hostname: process.env.HOST || 'localhost',
         port: process.env.PORT || 3000,
         path: url,
         method: method,
         headers: req.cookies
     },    async (r) => {

         await r.on('data', listener);

     }).end();
}

async function getUsers(req, res, userFound) {
     let data = [];
     await requestToApiUsers(req, res, userFound,'/users', 'GET', async (chunk) => {
        data.push(chunk);
        let binary = Buffer.concat(data);
        let encodeChunk = binary.toString('utf8');
        let getUsers = JSON.parse(encodeChunk);
        res.render('admin-panel', {
            name: userFound["name"],
            role: userFound["role"],
            phone: userFound["phone"],
            users: getUsers
        });
    });
}

async function addUsers(req, res, userFound, userAdd) {
    let data = [];
    await requestToApiUsers(req, res, userFound,'/users', 'POST', async (chunk) => {
        data.push(chunk);
        let binary = Buffer.concat(data);
        let encodeChunk = binary.toString('utf8');
        let getUser = JSON.parse(encodeChunk);
        res.render('admin-panel', {
            name: userFound["name"],
            role: userFound["role"],
            phone: userFound["phone"],
        });
    });
}


router.get('/', jsonParser, async (req, res) => {


    const cookies = req.cookies;
    const payload = jwt.verify(cookies.user, 'privateKey');
    const id = payload.id;
    const refrashToken = cookies.token;
    const userDocs =  await user.getById(id);
    let userFound;

   for (let i in userDocs) {
       if (userDocs[i]["_id"] + "" === id) {
           userFound = userDocs[i];
           break;
       }
   }
   if (!userFound) res.status(403).redirect(`../auth`);

   if (userFound["token"] !== refrashToken) {
       res.status(403).redirect(`../auth`);
   }

   console.log(req.query);

/*
   if (Boolean(req.query.login)) {
      await getUsers(req, res, userFound);
   }
   else if((Boolean(req.query.getAll))) {
       console.log("add user");

       await addUsers(req, res, req.query);
   }
   else {
       res.render('admin-panel', {
           name: userFound["name"],
           role: userFound["role"],
           phone: userFound["phone"],
       })
   }
*/

    res.render('admin-panel', {
        name: userFound["name"],
        role: userFound["role"],
        phone: userFound["phone"],
        users: req.query.users
    })

});

module.exports = router;