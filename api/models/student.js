var mongoose = require('mongoose');

var Student = mongoose.model('Student', {
    id: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    course: [{
        id: {
            type: String,
            required: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        marks: {
            type: Number,
            required: true,
            trim: true
        }
    }]
});

module.exports = { Student };
