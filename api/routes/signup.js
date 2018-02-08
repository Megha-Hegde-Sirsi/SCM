let express = require('express');
const bodyParser = require('body-parser');

const { ObjectID } = require('mongodb');
var { mongoose } = require('../db/mongoose');
var { Course } = require('../models/course');
var { Student } = require('../models/student');
var { User } = require('../models/users')
var { authenticate } = require('../.././authenticate/authenticate');


let router = express.Router();

//GET
router.get('/', (req, res) => {
    return res.send("working");
});

//STUDENTS SIGNUP
router.post('/signup', authenticate, (req, res) => {
    let studentsArr = new Array();
    let flag = 0;
    return new Promise((resolve, reject) => {
        req.body.forEach((student) => {
            let courseArr = new Array();
            if (student.id && student.name && student.course) {
                Student.findOneAndUpdate({ id: student.id }, { $set: { "Student.course": student.course, _creator: req.user._id } }, { new: true }, function (err, doc) {
                    if (err || !doc) {
                        student.course.forEach((course) => {
                            Course.findOne({ id: course.id }, (err, doc) => {
                                if (err) {
                                    flag = 0;
                                    console.log("Error in finding course details");
                                    res.status(400).send("Error in finding course details");
                                } else if (!doc) {
                                    flag = 0;
                                    console.log("Specified course id not found");
                                    reject("Specified course id not found");
                                    res.status(404).send("specified course id not found");
                                } else {
                                    courseArr.push(course);
                                    flag = 1;
                                }
                            })
                        })
                        setTimeout(() => {
                            if (flag === 1) {
                                let studentInfo = {
                                    id: student.id,
                                    name: student.name,
                                    course: courseArr,
                                    _creator: req.user._id
                                }
                                new Student(studentInfo).save();
                                studentsArr.push(studentInfo)
                                console.log("new student information saved");
                            }
                        }, 1000)
                    } else {
                        // let crc = new Array();
                        student.course.forEach((course) => {
                            Course.findOne({ id: course.id }, (err, doc) => {
                                if (err) {
                                    flag = 0;
                                    console.log("Error in finding course details");
                                    res.status(400).send("Error in finding course details");
                                    reject("Error in finding course details");
                                } else if (!doc) {
                                    flag = 0;
                                    console.log("Specified course id not found");
                                    res.status(404).send("specified course id not found");
                                    reject("Specified course id not found");
                                } else {
                                    courseArr.push(doc);
                                    flag = 1;
                                }
                            })
                            if (flag === 1) {
                                let studentInfo = {
                                    id: student.id,
                                    name: student.name,
                                    course: courseArr,
                                    _creator: req.user._id
                                }
                                studentsArr.push(studentInfo);
                                console.log("student information updated");
                            }
                        })
                    }
                });
            } else {
                res.status(400).send("complete information required for student");
                reject("Please fill all fields for student");
            }
        })
        setTimeout(() => {
            res.send(studentsArr);
            resolve();
        }, 1100)
    })
});

module.exports = router;