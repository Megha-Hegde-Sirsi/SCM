require('./api/config/config');

const express = require('express');
const bodyParser = require('body-parser');
var jwt = require('jwt-simple');

var app = express();
const port = process.env.PORT;
process.env = { MONGODB_URI: 'mongodb://127.0.0.1:27017/StudentsAndCourses' }

app.use(bodyParser.json());
app.use(require('./api/routes/signup'));
app.use(require('./api/routes/course'));
app.use(require('./api/routes/getStudents'));
app.use(require('./api/routes/getCourses'));
app.use(require('./api/routes/getStudentsByCourse'));
app.use(require('./api/routes/getStudentsByTime'));
app.use(require('./api/routes/getStudentsByMarks'));


app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = { app };