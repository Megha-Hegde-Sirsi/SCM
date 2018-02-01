let express = require('express');
const bodyParser = require('body-parser');
const db = require('mongodb');
const { ObjectID } = require('mongodb');
var { mongoose } = require('../db/mongoose');
var { Course } = require('../models/course');
var { Student } = require('../models/student');

let router = express.Router();

//GET STUDENTS BY COURSE (working)
router.patch('/students/byCourse', (req, res) => {
    return new Promise((resolve, reject) => {
        let resArr = new Array();
        Student.find({}, (err, results) => {
            if (err) {
                console.log("Error occured");
            }
            else if (!results) {
                console.log("data not found");
                res.status(404).send("data not found");
            } else {
                for (let i = 0; i < results.length; i++) {
                    results[i].course.forEach((course) => {
                        console.log(course)
                        if (course.id === req.body.id) {
                            resArr.push({ id: results[i].id, name: results[i].name, marks: course.marks });
                        }
                    })
                }
            }
        });
        setTimeout(() => {
            res.send(resArr);
            console.log(resArr)
            resolve();
        }, 1000)
    });
});


module.exports = router;