let express = require('express');
const bodyParser = require('body-parser');

const { ObjectID } = require('mongodb');
let { mongoose } = require('../db/mongoose');
let { Course } = require('../models/course');
let { Student } = require('../models/student');
let { User } = require('../models/users')
let { authenticate } = require('../.././authenticate/authenticate');

let router = express.Router();

//ADDING NEW COURSE
router.post('/course', authenticate, (req, res) => {
    funCourse(req.body, req.user).then((course) => {
        res.send(req.body);
    })
})

function funCourse(course, user) {
    return new Promise((resolve, reject) => {
        let resArr = new Array();
        Promise.all(course.map(function (crc) {
            Course.findOneAndUpdate({ id: crc.id }, { $set: crc }, { new: true }, (err, doc) => {
                if (err) {
                    reject("error occured");
                    return;
                } else if (!doc) {
                    console.log("new course record created")
                    let exm = new Course({
                        id: crc.id,
                        name: crc.name,
                        _creator: user._id
                    }).save();
                    resArr.push(exm)
                } else {
                    doc._creator = user._id
                    resArr.push(doc)
                    console.log("course information updated")
                }
            })
        })).then((res) => {
            resolve(res);
        })

    })
}

module.exports = router;