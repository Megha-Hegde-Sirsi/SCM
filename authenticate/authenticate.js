
let { User } = require('../api/models/users');

let authenticate = (req, res, next) => {
    console.log("entered authenticate")
    let token = req.header('Authorization');
    if (!token) {
        console.log("token required");
        res.status(401).send("authentication failed, set token")
    } else {
        console.log("there is a token\n", token)
        User.find({}, (err, result) => {
            if (err || !result) {
                console.log("no data of user to authenticate");
                res.status(404).send("authentication failed bcz no user")
            } else {
                console.log("there are users wait")
                result.forEach((user) => {
                    // console.log(user.token);
                    if (user.token === token) {
                        console.log("authentication succesful");
                        req.user = user;
                        req.token = token;
                        next();
                    } else {
                        console.log("user not matching")
                    }
                })
            }
        })
    }
};

module.exports = { authenticate };