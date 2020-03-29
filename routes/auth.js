var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.send("auth");
});

router.get('/login', (req, res) => {
    res.send("login");
});


module.exports = router;