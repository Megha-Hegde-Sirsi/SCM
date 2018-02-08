var mongoose = require('mongoose');

var Course = mongoose.model('Course', {
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
  _creator: {
    type: String
  }
});

module.exports = { Course };
