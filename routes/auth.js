const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
const jwtMiddleware = require('koa-jwt');
const user  = users.getUserDoc();

router.get('/', (req, res) => {
    res.send("auth");
});


router.post('/logout', async (req, res) => {
    const id = req.body.id;
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
        res.status(200).send("logout " + id);
    }
    else {
        res.status(404).send("Not found user");
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

router.get('/login', async (req, res) => {
    const login = req.body.login;
    const pass = req.body.pass;
    const refreshToken = uuid();
    let foundUser;

    let userDoc = await user.getAll().then( (value) => {
        return value;
    });

    for (let i in userDoc) {
       if (login === userDoc[i]["login"]) {
           foundUser = userDoc[i];
           console.log(login + " found");
           break;
       }
    }

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
        res.status(200).send( req.body = {
            token: jwt.sign({id: foundUser["_id"]}, 'privateKey'),
            refreshToken
        });

    }
});


module.exports = router;