let express = require('express');
const bodyParser = require('body-parser');
const db = require('mongodb');
let { mongoose } = require('../db/mongoose');
let { Course } = require('../models/course');
let { Student } = require('../models/student');
let { User } = require('../models/users')
let bcrypt = require('bcrypt');
let jwt = require('jwt-simple');
let config = require('.././config/database'); // get db config file
let { authenticate } = require('../.././authenticate/authenticate');

let router = express.Router();

//STUDENTS SIGNUP

router.post('/signup', authenticate, (req, res) => {
    console.log("entered into signup")
    let promise = new Array();
    req.body.map((student) => {
        let resArr = new Array();
        let newPromise = new Promise((resolve, reject) => {
            student.course.map((course) => {
                Course.findOne({ id: course.id }, (err, doc) => {
                    if (err || !doc) {
                        console.log("there is no record of course, select the existing course");
                        res.status(404).send("course details not found");
                        return reject("course details not proper")
                    } else {
                        console.log("Course information is fine...now going further")
                        student._creator = req.user._id;
                        Student.findOneAndUpdate({ id: student.id }, { $set: student }, { new: true }, (err, doc) => {
                            if (err || !doc) {
                                console.log("creating new student record. hope everything will be fine")
                                new Student(student).save();
                                resArr.push(student);
                            } else {
                                console.log("updating student record. hope everything will be fine")
                                Student.updateOne({ id: student.id }, { $set: student }, { new: true });
                                resArr.push(student);
                            }
                            resolve(resArr)
                        }); //Student.findoneandupdate
                    } //else
                    console.log("line before resolve statement")
                }); //course.findone
            }); //course.map
        }).catch((e) => {
            console.log("see there is the exception\n", e)
        })
        promise.push(newPromise); //promise.push
    }); //body.map
    Promise.all(promise).then((result) => {
        console.log(promise)
        console.log(result, "--------------------------")
        res.send(result)
        console.log("promise all execution")
    });
});

module.exports = router;