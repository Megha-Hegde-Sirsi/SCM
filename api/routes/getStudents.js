let express = require('express');
const bodyParser = require('body-parser');
const db = require('mongodb');
const { ObjectID } = require('mongodb');
var { mongoose } = require('../db/mongoose');
var { Course } = require('../models/course');
var { Student } = require('../models/student');

let router = express.Router();

//GET ALL STUDENT LIST (working)
router.get('/students', (req, res) => {
    return new Promise((resolve, reject) => {
        Student.find({}, (err, result) => {
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