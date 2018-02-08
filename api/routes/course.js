let express = require('express');
const bodyParser = require('body-parser');

const { ObjectID } = require('mongodb');
var { mongoose } = require('../db/mongoose');
var { Course } = require('../models/course');
var { Student } = require('../models/student');
var { User } = require('../models/users')
var { authenticate } = require('../.././authenticate/authenticate');

let router = express.Router();
let courseArr = new Array();
let promiseCourse;

//ADDING NEW COURSE
router.post('/course', authenticate, (req, res) => {
    console.log("entered the route")
    return new Promise((resolve, reject) => {
        for (let i = 0; i < req.body.length; i++) {
            let course = req.body[i];
            if (course.id && course.name) {
                // let info = req.body;
                let courseInfo = {
                    id: course.id,
                    name: course.name,
                    _creator: req.user._id
                }
                addCourse(courseInfo);
            } else {
                res.status(400).send("complete information required for course");
                reject("Please fill all fields for course");
            }
        }
        // resolve();
        setTimeout(() => {
            res.send(courseArr);
        }, 1000);
    })
})

//[PROCEDURE]: ADD OR UPDATE COURSE INFORMATION  
function addCourse(course) {
    if (course) {
        Course.findOneAndUpdate({ id: course.id }, { $set: course }, { new: true }, function (err, doc) {
            if (err || !doc) {
                new Course(course).save();
                courseArr.push(course);
                console.log("new course information saved");
            } else {
                courseArr.push(course);
                console.log("course information updated");
            }
        });
    } else {
        console.log("something went wrong with course information");
    }
}



module.exports = router;