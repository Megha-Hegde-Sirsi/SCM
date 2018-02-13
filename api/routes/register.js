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
    let hpassword;
    if (!req.body.id || !req.body.name || !req.body.password) {
        console.log("----------------------here is the error")
        res.json({ success: false, msg: 'Please pass name and password.' });
    } else {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                console.log("----------error---------", err)
            }
            bcrypt.hash(req.body.password, salt, function (err, hash) {
                if (err) {
                    console.log("----------error while hashing---------", err)
                } else {
                    hpassword = hash;
                    let newUser = { id: req.body.id, name: req.body.name, password: req.body.password, hPassword: hpassword }
                    new User(newUser).save((err, doc) => {
                        if (err || !doc) {
                            console.log("couldnt save new user", err);
                            res.status(400).send("couldnt save new user")
                        } else {
                            console.log(doc)
                            res.send(doc)
                        }
                    });
                }
            });
        });
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