let express = require('express');
const bodyParser = require('body-parser');
const db = require('mongodb');
const { ObjectID } = require('mongodb');
var { mongoose } = require('../db/mongoose');
var { Course } = require('../models/course');
var { Student } = require('../models/student');

let router = express.Router();

//GET STUDENTS BY CREATED AT (working)
router.patch('/students/timestamp', (req, res) => {
    let resArr = new Array();
    return new Promise((resolve, reject) => {
        Student.find({}, (err, result) => {
            if (err) {
                console.log("---------------sorry error-------------");
            } else if (!result) {
                console.log("---------------no data found------------");
                res.status(404).send("there is no student data");
            } else {
                for (let i = 0; i < result.length; i++) {
                    let newId = ObjectID(result[i]._id);
                    let time = ObjectID(result[i]._id).getTimestamp().toString().slice(0, 15);
                    console.log("------------time you asked for------------", time);
                    if (time === req.body.time) {
                        console.log("-----found data-------------")
                        setTimeout(() => {
                            Student.find({ _id: ObjectID(result[i]._id) }, (err, result) => {
                                if (!result) {
                                    console.log("------------check the code again----")
                                }
                                else if (result) {
                                    resArr.push(result);
                                }
                            })
                        }, 1000)
                    } else {
                        console.log("there is nothing to show!!!!!!!!");
                        res.status(404).send("no data of student")
                    }
                }
            }
        })
        setTimeout(() => {
            console.log("**************results array**************", resArr)
            res.send(resArr);
            resolve();
        }, 2000)
    })
})

module.exports = router;
