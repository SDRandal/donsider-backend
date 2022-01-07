const { plan } = require("../models")


db = require("../models")
const User = db.user

userOwnsPlanById = (req, res, next) => {
    User.findById(req.userId, (err, user) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (!user) {s
            return res.status(403).send({ message: "Cannot delete,Forbidden" })
        }
        const planSearch = user.plans.find((plan) => {
            return req.params.pid == plan._id
        })
        if (!planSearch) {
            return res.status(403).send({ message: "Plan does not belongs to you. Forbidden" })
        }else{
            next()
        }
    }
    )
}

const verifyOwnership = {
    userOwnsPlanById
}

module.exports = verifyOwnership
