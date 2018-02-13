let express = require('express');
const bodyParser = require('body-parser');
const db = require('mongodb');
const { ObjectID } = require('mongodb');
var { mongoose } = require('../db/mongoose');
var { Course } = require('../models/course');
var { Student } = require('../models/student');
var { User } = require('../models/users')
var { authenticate } = require('../.././authenticate/authenticate');


let router = express.Router();
let resArr = new Array();

router.get('/', (req, res) => {
    Student.find({}, (err, result) => {
        if (err || !result) {
            console.log("no result")
        } else {
            result.map((student) => {
                let time = ObjectID(student._id).getTimestamp().toString().slice(0, 15)
                console.log(time, "\n")
            })
        } res.send("something is happening check the console")
    })
})

//GET ALL STUDENT LIST (not complete)
router.get('/students', authenticate, (req, res) => {
    let resArr = new Array();
    console.log("-----------------", req.query, "-----------------------")
    if (req.query.courseId) {           //Working 
        return new Promise((resolve, reject) => {
            let crc = req.query.courseId;
            Student.find({ _creator: req.user._id, "course.id": crc }, (err, resu) => {
                if (err) {
                    console.log("Error occured");
                }
                else if (!resu) {
                    console.log("data not found");
                    res.status(404).send("data not found");
                } else {
                    res.send(resu)
                }
            });
        })
    }
    else if (req.query.min || req.query.max) {            //Working
        return new Promise((resolve, reject) => {
            console.log("entered the marks part")
            Student.find({ _creator: req.user._id, "course.marks": { $lte: req.query.max, $gte: req.query.min } }, (err, results) => {
                if (err) {
                    console.log("hey error occured");
                    res.status(400).send("hey error occured");
                } else if (results === []) {
                    console.log("hey there are no records");
                    res.status(404).send("there are no records dude");
                } else {
                    console.log("yeah results are there")
                    console.log(results)
                    res.send(results);
                    resolve();
                }
            })

        })
    }

    else if (req.query.time) {                  //(working)
        console.log("time function")
        new Promise((resolve, reject) => {
            console.log("entered first main promise")
            Student.find({ _creator: req.user._id }, (err, result) => {
                console.log("entered student find all")
                if (err) {
                    console.log("---------------sorry error-------------");
                    reject("error", err)
                } else if (!result) {
                    console.log("---------------no data found------------");
                    res.status(404).send("there is no student data");
                    reject("no data")
                } else {
                    console.log("results are there wait")
                    result.map((result) => {
                        let time = ObjectID(result._id).getTimestamp().toString().slice(0, 15)
                        console.log(time)
                        if (time === req.query.time) {
                            console.log(result);
                            resArr.push(result);
                        } else {
                            console.log("there is no match...that is the problem")
                        } console.log(resArr, "-----------------");
                    });
                    resolve()
                }
            })
        }).then(() => {
            res.send(resArr)
        }).catch((e) => {
            console.log("exception occured\n", e)
        })
    }

    else {                    //Working
        return new Promise((resolve, reject) => {
            Student.find({ _creator: req.user._id }, (err, result) => {
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
    }
});

module.exports = router;