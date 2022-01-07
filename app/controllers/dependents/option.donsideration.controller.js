const db = require("../../models")
const helpers = require("../helpers/plan.helper")
const Plan = db.plan
const Option = db.donsideration.option

exports.addDonsiderationOption = (req, res) => {
    const planId = req.params.pid
    const donsiderationId = req.params.did

    Plan.findById(planId, (err, plan) => {
        if (err) {
            return res.status(500).send({ message: "There was an issue locating the requested plan", err })
        }
        if (!plan) {
            return res.status(404).send({ message: "The requested plan does not exist" })
        }

        const targetDonsideration = helpers.findDonsideration(plan, donsiderationId)

        if (!targetDonsideration) {
            return res.status(403).send({ message: "Donsideration not found" })
        } else {
            const newDonsiderationOption = new Option({
                content: req.body.content
            })

            targetDonsideration.options.push(newDonsiderationOption)

            plan.donsiderations = helpers.replaceItem(plan.donsiderations, donsiderationId, targetDonsideration)
            plan.save()
            res.send({newProperty: plan.donsiderations, planId: req.params.pid, propertyType: "donsiderations",message: "Donsideration option successfully added" })
        }
    })
}
exports.updateDonsiderationOption = (req, res) => {
    // TODO Holy moly, yeah this has gotten out of hand. There are still pros and cons to do, which will be an additional level of nesting
    const planId = req.params.pid
    const donsiderationId = req.params.did
    const optionId = req.params.oid

    Plan.findById(planId, (err, plan) => {
        if (err) {
            return res.status(500).send({ message: "There was an issue locating the requested plan", err })
        }
        if (!plan) {
            return res.status(404).send({ message: "The requested plan does not exist" })
        }
        const targetDonsideration = helpers.findDonsideration(plan, donsiderationId)

        if (!targetDonsideration) {
            return res.status(404).send({ message: "Donsideration not found" })
        } else {

            const targetOption = helpers.findOption(targetDonsideration, optionId)
            for (key in req.body) {
                if (key === "_id") {
                    return res.status(403).send({ message: "Cannot update object id" })
                }
                if (targetOption[key]) {
                    targetOption[key] = req.body[key]
                } else {
                    return res.status(500).send({ message: "Update failed, invalid key provided" })
                }
            }

            targetDonsideration.options = helpers.replaceItem(targetDonsideration.options, optionId, targetOption)

            plan.donsiderations = helpers.replaceItem(plan.donsiderations, donsiderationId, targetDonsideration)
            plan.save()
            res.send({newProperty: plan.donsiderations, planId: req.params.pid, propertyType: "donsiderations",message: "Donsideration option successfully updated" })
        }
    })
}
exports.removeDonsiderationOption = (req, res) => {
    const planId = req.params.pid
    const donsiderationId = req.params.did
    const optionId = req.params.oid

    Plan.findById(planId, (err, plan) => {
        if (err) {
            return res.status(500).send({ message: "There was an issue locating the requested plan", err })
        }
        if (!plan) {
            return res.status(404).send({ message: "The requested plan does not exist" })
        }
        const targetDonsideration = helpers.findDonsideration(plan, donsiderationId)

        if (!targetDonsideration) {
            return res.status(403).send({ message: "Donsideration not found" })
        } else {
            targetDonsideration.options = targetDonsideration.options.filter((option) => {
                if (option) {
                    return option._id != optionId
                }
            })
        }
        plan.donsiderations = helpers.replaceItem(plan.donsiderations, donsiderationId, targetDonsideration)
        plan.save()
        res.send({ newProperty: plan.donsiderations, planId: req.params.pid, propertyType: "donsiderations",message: "Donsideration option successfully removed" })
    })
}