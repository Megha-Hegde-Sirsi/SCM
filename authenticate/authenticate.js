
var { User } = require('../api/models/users');

var authenticate = (req, res, next) => {
    var token = req.header('Authorization');
    if (!token) {
        console.log("token required");
        res.status(401).send("authentication failed")
    } else {
        User.find({}, (err, result) => {
            if (err || !result) {
                console.log("no data of user to authenticate");
                res.status(404).send("authentication failed bcz no user")
            } else {
                result.forEach((user) => {
                    // console.log(user.token);
                    if (user.token === token) {
                        console.log("authentication succesful");
                        req.user = user;
                        req.token = token;
                        next();
                    }
                })
            }
        })
    }
};

module.exports = { authenticate };