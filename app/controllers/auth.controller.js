const config = require("../config/auth.config")
const db = require("../models")
const User = db.user
const Role = db.role

var jwt = require("jsonwebtoken")
var bcrypt = require("bcryptjs")

exports.signup = (req, res) => {
    console.log(req.body);

    const user = new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 8),
        avatarUrl: "https://d1c99iomjiepbv.cloudfront.net/public/images/default-user.png"
    })

    user.save((err, user) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (req.body.roles) {
            Role.find(
                {
                    name: { $in: req.body.roles }
                },
                (err, roles) => {
                    if (err) {
                        return res.status(500).send({ message: err })
                    }
                    user.roles = roles.map(role => role._id)
                    // TODO Why would I save the user twice? shoudln't I just wait to save the user until the end?
                    user.save((err) => {
                        if (err) {
                            return res.status(500).send({ message: err })
                        }

                        return res.send({ message: "Successfully registered new user" })
                    })
                })
        } else {
            Role.findOne({ name: "user" }, (err, role) => {
                if (err) {
                    return res.status(500).send({ message: err })
                    
                }
                user.roles = [role._id]
                user.save((err) => {
                    if (err) {
                        return res.status(500).send({ message: err })
                    }
                    
                    // return res.send({ message: "Successfully registered new user" })
                    return res.redirect("/api/auth/signin")
                })
            })
        }

    })
}

exports.signin = (req, res) => {
    console.log(req.body)
    User.findOne({
        username: req.body.username
    })
        .populate("roles", "-__v")
        .exec((err, user) => {
            if (err) {
                return res.status(500).send({ message: err })
            }
            if (!user) {
                 return res.status(404).send({ message: "User not Found" })
            }
            // does this kind of assignment automaticallyrun the bcrypt function? It doesn't look like it gets called when its used later
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            )

            if (!passwordIsValid) {
                 return res.status(401).send({
                    message: "Invalid Password"
                })
            }

            var token = jwt.sign({ id: user.id, username: user.username, roles: authorities,
 }, config.secret, {
                expiresIn: 86400
            })

            var authorities = []
            for (let i = 0; i < user.roles.length; i++) {
                authorities.push("ROLE_" + user.roles[i].name.toUpperCase())
            }
            res.status(200).send({
                id: user._id,
                profileImage: user.profileImageUrl ? user.profileImageUrl : "https://d1c99iomjiepbv.cloudfront.net/public/images/default-user.png",
                accessToken: token
            })
        })
}