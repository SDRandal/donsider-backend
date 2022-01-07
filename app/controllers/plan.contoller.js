const db = require("../models")
const priorities = require("../models/constants/priority.constant")
const attachmentController = require("../controllers/dependents/attachment.controller")
const Plan = db.plan
const User = db.user

const createNewPlan = (user, title, goal = "Add a goal to you plan.") => {
    const plan = new Plan({
        title: title,
        goal: goal,
        users: [{ _id: user._id, avatarUrl: user.avatarUrl }],
        tasks: [],
        notes: [],
        donsiderations: [],
        priority: priorities.HIGH,
        attachments: [],
        tags: [],
        createDate: new Date(),
        // TODO I need to remember to go back and add "due date" to the plan creation modal
        dueDate: new Date()
    })
    plan.save()
    return plan
}

const planBelongsToUser = (userId, planUsers) => {
    return planUsers.find((user) => {
        return user._id == userId
    })
}

exports.create = (req, res) => {
    let plan, currentUser
    User.findById(req.userId, (err, user) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (!user) {
            return res.status(404).send({ message: "User not found" })
        }
        plan = createNewPlan(user, req.body.title, req.body.goal)
        user.plans.push(plan._id)
        user.save()
        currentUser = user
        return res.send(plan)
    })
}
exports.read = (req, res) => {
    const id = req.params.pid
    const userId = req.userId
    // I really wish I knew what these errors were returning to... I think this is a javascript thing
    Plan.findOne({ _id: id }, (err, plan) => {
        if (err) {
            //TODO there is a strange casting issue here when the pid is above a certain length
            return res.status(500).send({ message: err })
        }
        if (!plan) {
            return res.status(404).send({ message: "Plan not found" })
        }
        if (!planBelongsToUser(userId, plan.users)) {
            res.status(403).send({ message: "Forbidden Plan" })
        } else {
            res.send(plan)
        }
    })
}

exports.update = (req, res) => {
    const reqKeys = Object.keys(req.body)
    if (reqKeys.length === 0) {
        // I saw another tutorial that returns the response here... why?
        return res.status(400).send({ message: "Improperly formatted update request" })
    }

    const id = req.params.pid
    const property = req.query.p
    //TODO I feel like some check of the req.body needs to happen. Like to check if the data is an array
    Plan.findById(id, (err, plan) => {
        if (err) {
            return res.status(500).send({ message: "There was an issue locating the requested plan", err })
        }
        if (!plan) {
            return res.status(404).send({ message: "The requested plan does not exist" })
        }
        if (!plan[property]) {
            return res.status(404).send({ message: "The requested property does not exist" })

        }
        if (property === "priority") {
            console.log("Need to check if the string sent is a valid value for priority")
        }

        // TODO How can I make sure that the proerty value sent is clean? Maybe my sanitize method looks at the request and property sent and conditionally sanitizes the object?
        plan[property] = req.body[property]
        plan.save()
        res.send({ planId: id, newProperty: req.body[property], propertyType: property, message: "The requested property does not exist" })

    })
}
exports.delete = (req, res) => {
    const id = req.params.pid

    Plan.findByIdAndRemove(id)
        .then((data) => {
            data.attachments.forEach((attachment)=> {
                attachmentController.deleteAttachmentFromS3(attachment.persistentFileName)
            })  
            if (!data) {
                return res.status(404).send({ message: "Plan not found" })
            } else {
                return res.send({ message: "Plan deleted" })
            }
        })
        .catch((err) => {
            return res.status(500).send({ message: err })
        })
}
exports.all = (req, res) => {
    const userId = req.userId

    User.findById(userId)
        .populate('plans')
        .then((user) => {

            if (!user) {
                return res.status(400).send({ message: "No Plans found" })
            } else {
                return res.send(user.plans)
            }
        })
        .catch((err) => {
            return res.status(500).send({ message: err })
        })
}
