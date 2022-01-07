db = require("../models")
const ROLES = db.ROLES
const User = db.user

checkDuplicateUsername = (req, res, next) => {
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        // Error running query
        if (err) {
            return res.status(500).send({ message: err })
        }
        // Username Exists already
        if (user) {
            return res.status(400).send({ message: "This username is already in use." })
        }

        User.findOne({
            username: req.body.username
        }).exec((err, user) => {
            if (err) {
                return res.status(500).send({ message: err })
            }

            if (user) {
                return res.status(400).send({ message: "This username is already in use" })
            }

            next()
        })
    })
}

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                return res.status(400).send({ message: `Role ${req.body.role[i]} does not exist` })
            }
        }
    }
    next()
}

const verifySignUp = {
    checkDuplicateUsername,
    checkRolesExisted
}

module.exports = verifySignUp