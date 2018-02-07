let express = require('express');
const bodyParser = require('body-parser');

const { ObjectID } = require('mongodb');
var { mongoose } = require('../db/mongoose');
var { Course } = require('../models/course');
var { Student } = require('../models/student');
var { User } = require('../models/users')


let router = express.Router();

router.get('/courses', (req, res) => {
    return new Promise((resolve, reject) => {
        Course.find({}, (err, result) => {
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