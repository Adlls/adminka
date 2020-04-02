const express = require('express');
const app = express();
const router = express.Router();
const users = require('../controllers/users');
const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const user  = users.getUserDoc();
const urlencodedParser = bodyParser.urlencoded({extended: false});
cookieParser = require('cookie-parser');

app.use(cookieParser('secret key'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



router.get('/', (req, res) => {
    res.render('auth');
});


router.get('/logout', async (req, res) => {
    const cookies = req.cookies;
    const payload = jwt.verify(cookies.user, 'privateKey');
    const id = payload.id;
    let foundUser;
    let userDoc = await user.getAll().then((value) => {
        return value;
    });
    for (let i in userDoc) {
        if (userDoc[i]["_id"]+"" === id) {
            foundUser = userDoc[i];
            break;
        }
    }
    if (foundUser && foundUser["token"] !== null) {
        let updateDataset = {
            name: foundUser.name,
            pass: foundUser.pass,
            email: foundUser.email,
            phone: foundUser.phone,
            role: foundUser.role,
            token: undefined
        }
        await user.update(id, updateDataset);
        res.status(200).redirect(`/auth`);
    }
    else {
        res.redirect(`./`);
    }
});

router.post('/refresh', async (req, res) => {
   const refreshToken = req.body.refreshToken;
   const NewRefreshToken = uuid();
   let foundUser;

   let userDoc = await user.getAll().then((value) => {
      return value;
   });
   for (let i in userDoc) {
       if (userDoc[i]["token"] === refreshToken) {
           foundUser = userDoc[i];
           break;
       }
    }

   if(!foundUser) {
       res.status(401).send("Not found refresh token");
   }
   else {
       let updateDataset = {
           name: foundUser.name,
           pass: foundUser.pass,
           email: foundUser.email,
           phone: foundUser.phone,
           role: foundUser.role,
           token: NewRefreshToken
       };
       await user.update(foundUser["_id"], updateDataset);
       res.status(200).send( req.body = {
           token: jwt.sign({id: foundUser["_id"]}, 'privateKey'),
           NewRefreshToken
       });
   }

});

router.post('/login', urlencodedParser, async (req, res) => {
    const login = req.body.login;
    const pass = req.body.pass;
    const refreshToken = uuid();
    let foundUser;
    let userDoc = await user.getAll();
    for (let i in userDoc) {
       if (login === userDoc[i]["login"]) {
           foundUser = userDoc[i];
           console.log(login + " found");
           break;
       }
    }

    if (!foundUser) res.status(403).send("User not found");
    if (pass !== foundUser["pass"]) {
        console.log("Incorrent password!");
        res.status(403).send("Auth error");
    }
    else {
        let updateDataset = {
            name: foundUser.name,
            pass: foundUser.pass,
            email: foundUser.email,
            phone: foundUser.phone,
            role: foundUser.role,
            token: refreshToken
        };
        await user.update(foundUser["_id"], updateDataset);
        res.cookie('user', `${ jwt.sign({ id: foundUser["_id"]}, 'privateKey')}`);
        res.cookie('token', `${refreshToken}`);
        res.status(200).redirect(`../admin`);
    }

});


module.exports = router;