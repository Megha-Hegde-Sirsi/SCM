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

//GET ALL STUDENT LIST (not complete)
router.get('/students', authenticate, (req, res) => {
    let resArr = new Array();
    console.log("-----------------", req.query, "-----------------------")
    if (req.query.courseId) {           //Working 
        return new Promise((resolve, reject) => {
            let crc = req.query.courseId;
            console.log("---------------CRC", crc)
            Student.find({_creator:req.user._id}, (err, resu) => {
                if (err) {
                    console.log("Error occured");
                }
                else if (!resu) {
                    console.log("data not found");
                    res.status(404).send("data not found");
                } else {
                    resu.forEach((resul) => {
                        resul.course.forEach((result) => {
                            if (result.id === crc) {
                                resArr.push({ id: resul.id, name: resul.name })
                            }
                        })
                    });
                }
            }); setTimeout(() => {
                console.log("--------------------------------", resArr, "----------------------------------");
                res.send(resArr);
            }, 1000)
        })

    } else if (req.query.min || req.query.max) {            //Working
        console.log(req.query.min, req.query.max)
        console.log("entered into this route")
        return new Promise((resolve, reject) => {
            let min = req.query.min, max = req.query.max;
            let resArr = new Array();
            Student.find({_creator:req.user._id}, (err, results) => {
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
                            if (marks <= max && marks >= min) {
                                Student.find({ marks: marks }, (err, doc) => {
                                    if (err) {
                                        console.log("Hey sorry error");
                                    } else if (!doc) {
                                        console.log("hey there are no records that come under your filter");
                                        res.status(404).send("No records matches your search criteria");
                                    } else {
                                        resArr.push({ id: results[i].id, name: results[i].name, course: course.name, marks: course.marks });
                                        console.log(resArr)
                                    }
                                })
                            }
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
    } else if (req.query.time) {                //(working)
        return new Promise((resolve, reject) => {
            Student.find({_creator:req.user._id}, (err, result) => {
                if (err) {
                    console.log("---------------sorry error-------------");
                } else if (!result) {
                    console.log("---------------no data found------------");
                    res.status(404).send("there is no student data");
                } else {
                    for (let i = 0; i < result.length; i++) {
                        let newId = ObjectID(result[i]._id);
                        let time = ObjectID(result[i]._id).getTimestamp().toString().slice(0, 15);
                        if (time === req.query.time) {
                            setTimeout(() => {
                                Student.find({ _id: ObjectID(result[i]._id) }, (err, results) => {
                                    if (err || !results) {
                                        console.log("------------check the code again----")
                                    }
                                    else if (results) {
                                        resArr.push(results);
                                    }
                                })
                            }, 1000)
                        } else {
                            console.log("there is nothing to show!!!!!!!!");
                        }
                    }
                }
            })
            setTimeout(() => {
                res.send(resArr);
                resolve();
            }, 2000)
        })
    }
    else {                    //Working
        console.log("no parameters place")
        return new Promise((resolve, reject) => {
            Student.find({_creator:req.user._id}, (err, result) => {
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