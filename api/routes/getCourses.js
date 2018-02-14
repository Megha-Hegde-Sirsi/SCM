let express = require('express');
const bodyParser = require('body-parser');

const { ObjectID } = require('mongodb');
let { mongoose } = require('../db/mongoose');
let { Course } = require('../models/course');
let { Student } = require('../models/student');
let { User } = require('../models/users')
let { authenticate } = require('../.././authenticate/authenticate');

let router = express.Router();

router.get('/courses', authenticate, (req, res) => {
    return new Promise((resolve, reject) => {
        Course.find({_creator:req.user._id}, (err, result) => {
            if (err) {
                console.log("Error in finding all students list", err);
                reject("Error in finding all students list");
            } else if (!result) {
                res.status(404).send("Data not found");
                resolve();
            } else {
                res.send(result);
                resolve();
            }
        });
    });
});

module.exports = router;