let express = require('express');
const bodyParser = require('body-parser');
const db = require('mongodb');
const { ObjectID } = require('mongodb');
var { mongoose } = require('../db/mongoose');
var { Course } = require('../models/course');
var { Student } = require('../models/student');
var { User } = require('../models/users')
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var config = require('.././config/database'); // get db config file

let router = express.Router();

router.post('/register', function (req, res) {                  //(working)
    console.log("I am here")
    let hpassword;
    for (let i = 0; i < req.body.length; i++) {
        console.log(req.body[i])
        if (!req.body[i].id || !req.body[i].name || !req.body[i].password) {
            console.log("----------------------here is the error")
            res.json({ success: false, msg: 'Please pass name and password.' });
        } else {
            bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                    console.log("----------error---------", err)
                }
                bcrypt.hash(req.body[i].password, salt, function (err, hash) {
                    if (err) {
                        console.log("----------error while hashing---------", err)
                    } else {
                        hpassword = hash;
                        let newUser = { id: req.body[i].id, name: req.body[i].name, password: req.body[i].password, hPassword: hpassword }
                        new User(newUser).save()
                        res.send(newUser)
                    }
                });
            });
        }
    }
});

router.post('/register/authenticate', (req, res) => {               //(working)
    console.log("---", req.body.password)
    User.findOne({ name: req.body.name }, function (err, user) {
        if (err) console.log("--------error authenticating", err)
        if (!user) {
            res.send({ success: false, msg: 'Authentication failed. User not found.' });
        } else {
            let psw = user.password;
            console.log(psw)
            if (psw === req.body.password) {
                var token = jwt.encode(user, config.secret);
                User.updateOne({ name: user.name }, { token: token }, (err, result) => {
                    if (err) {
                        console.log("error updating token");
                    } else {
                        console.log("token saved succesfully")
                    }
                });
                res.send({ success: true, token: token })
            } else {
                res.status(401).send("authentication failed")
            }
        }
    });
})

module.exports = router;