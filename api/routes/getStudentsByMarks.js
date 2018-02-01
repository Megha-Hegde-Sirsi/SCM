let express = require('express');
const bodyParser = require('body-parser');
const db = require('mongodb');
const { ObjectID } = require('mongodb');
var { mongoose } = require('../db/mongoose');
var { Course } = require('../models/course');
var { Student } = require('../models/student');

let router = express.Router();

//GET STUDENTS LIST BY MARKS RANGE
router.patch('/students/marks', (req, res) => {
    return new Promise((resolve, reject) => {
        let min = req.body.min, max = req.body.max;
        let resArr = new Array();
        Student.find({}, (err, results) => {
            if (err) {
                console.log("hey error occured");
                res.status(400).send("hey error occured");
            } else if (!results) {
                console.log("hey there are no records");
                res.status(404).send("there are no records dude");
            } else {
                for (let i = 0; i < results.length; i++) {
                    results[i].course.forEach((course) => {
                        let marks = course.marks;
                        Student.find({ marks: { $gt: min, $lt: max } }, (err, doc) => {
                            if (err) {
                                console.log("Hey sorry error");
                            } else if (!doc) {
                                console.log("hey there are no records that come under your filter");
                                res.status(404).send("No records matches your search criteria");
                            } else {
                                resArr.push({ id: results[i].id, name: results[i].name, course: course.name, marks: course.marks });
                            }
                        })
                    })
                }
            }
        })
        setTimeout(() => {
            console.log("------------------------", resArr, "------------------------");
            res.send(resArr);
            resolve();
        }, 1000)
    })
})


module.exports = router;
