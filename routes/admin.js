const express = require('express');
const app = express();
const router = express.Router();
const users = require('../controllers/users');
const user  = users.getUserDoc();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const jsonParser = express.json();
var multer = require('multer');
var upload = multer();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload.array());

router.get('/', jsonParser, async (req, res) => {
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

   if (Boolean(req.query.getUsers)) options["getUsers"] = userDocs;




    if (userFound["token"] == refrashToken) {
       res.render('admin-panel', {
           name: userFound["name"],
           role: userFound["role"],
           phone: userFound["phone"],
           options: options,
       });


   }
   else {
       res.status(403).redirect(`../auth`);
   }
});

module.exports = router;