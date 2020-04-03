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
/*
    request('http://localhost:3000/users', function (error, response, body) {
        console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
    });
 */

    const cookies = req.cookies;
    const payload = jwt.verify(cookies.user, 'privateKey');
    const id = payload.id;
    const refrashToken = cookies.token;
    const userDocs =  await user.getById(id);
    let userFound;
    let options;

   for (let i in userDocs) {
       if (userDocs[i]["_id"] + "" == id) {
           userFound = userDocs[i];
           break;
       }
   }
   if (!userFound) res.status(403).redirect(`../auth`);

    options = {
        url: process.env.HOST + ":3000"+ "/users",
        users: userDocs,
    };

   if (userFound["role"] === "admin") options["isAdmin"] = true;
   else options["isAdmin"] = false;

   if (userFound["token"] !== refrashToken) {
       res.status(403).redirect(`../auth`);
   }

   if (Boolean(req.query.getAll)) {
       //options["getUsers"] = userDocs;
      await http.request({
           hostname: 'localhost',
           port: 3000,
           path: '/users',
           method: 'GET',
           headers: req.cookies

       },    async (r) => {
             await r.on('data',   async (chunk) => {
               console.log('saved');
               options["getUsers"] = chunk;
                    options["getUsers"] = chunk;
                     res.render('admin-panel', {
                         name: userFound["name"],
                         role: userFound["role"],
                         phone: userFound["phone"],
                         options: options,
                     });
                 console.log("opt >>> " + options["getUsers"]);

           });
       }).end();
   }
   else {
       res.render('admin-panel', {
           name: userFound["name"],
           role: userFound["role"],
           phone: userFound["phone"],
           options: options,
       })
   }


});

module.exports = router;