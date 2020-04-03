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
    await requestToApiUsers(req, res, userFound,'/users', 'GET', async (chunk) => {

        res.render('admin-panel', {
            name: userFound["name"],
            role: userFound["role"],
            phone: userFound["phone"],
            users: null
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
       if (userDocs[i]["_id"] + "" == id) {
           userFound = userDocs[i];
           break;
       }
   }
   if (!userFound) res.status(403).redirect(`../auth`);

    if (userFound['role'] === 'admin')

   if (userFound["token"] !== refrashToken) {
       res.status(403).redirect(`../auth`);
   }

   if (Boolean(req.query.getAll)) {
      await getUsers(req, res, userFound);
   }
   else {
       res.render('admin-panel', {
           name: userFound["name"],
           role: userFound["role"],
           phone: userFound["phone"],
       })
   }


});

module.exports = router;