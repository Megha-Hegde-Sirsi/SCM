let mongoose = require('mongoose');

let User = mongoose.model('User', {
    id: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    hPassword: {
        type: String
    },
    token: {
        type: String
    }
});

module.exports = { User };