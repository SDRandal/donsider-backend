const { plan } = require("../../models")
const db = require("../../models")
const helpers = require("../helpers/plan.helper")
const Plan = db.plan
const User = db.user
const Tag = db.tag

exports.addTag = (req, res) => {
    Plan.findById(req.params.pid, (err, plan) => {
        if (err) {
            return res.status(500).send({ message: "There was an issue locating the requested plan", err })
        }
        if (!plan) {
            return res.status(404).send({ message: "The requested plan does not exist" })
        }

        const tagQuery = plan.tags.find((tag) => tag.name == req.body.name)
        if (!tagQuery) {
            const newTag = new Tag({
                name: req.body.name
            })
            plan.tags.push(newTag)
            plan.save()
            res.send({  newProperty: plan.tags, planId: req.params.pid, propertyType: "tags",message: "Plan from the tag controller" })

        } else {
            res.send({ message: "Tag already exists" })
        }

    })
}
exports.updateTag = (req, res) => {
    const planId = req.params.pid
    const tagId = req.params.tagId

    Plan.findById(planId, (err, plan) => {
        if (err) {
            return res.status(500).send({ message: "There was an issue locating the requested plan", err })
        }
        if (!plan) {
            return res.status(404).send({ message: "The requested plan does not exist" })
        }
        const targetTag = plan.tags.find((tag) => tag._id = tagId)
        if (!targetTag) {
            return res.status(404).send({ message: "The requested tag does not exist" })
        } else {
            for (key in req.body) {
                if (key === "_id") {
                    return res.status(403).send({ message: "Cannot update object id" })
                }
                if (targetTag[key]) {
                    targetTag[key] = req.body[key]
                }
            }
            plan.tags = helpers.replaceItem(plan.tags, tagId, targetTag)
            plan.save()
                .then((data) => { console.log(data) })
            res.send({ newProperty: plan.tags, planId: req.params.pid, propertyType: "tags",message: "Tag updated from step controller" })

        }

    })
}
exports.removeTag = (req, res) => {
    const planId = req.params.pid
    const tagId = req.params.tagId

    Plan.findById(planId, (err, plan) => {
        if (err) {
            return res.status(500).send({ message: "There was an issue locating the requested plan", err })
        }
        if (!plan) {
            return res.status(404).send({ message: "The requested plan does not exist" })
        }

        plan.tags = plan.tags.filter((tag) => tag._id != tagId)
        plan.save()
        res.send({ newProperty: plan.tags, planId: req.params.pid, propertyType: "tags",message: "Tag successfully deleted" })

    })
}
