const db = require("../../models")
const helpers = require("../../controllers/helpers/plan.helper")
const Plan = db.plan
const Con = db.donsideration.option.con

exports.addDonsiderationOptionCon = (req, res) => {
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

        const targetDonsideration = plan.donsiderations.find((donsideration) => donsideration._id == donsiderationId)
        if (!targetDonsideration) {
            return res.status(404).send({ message: "Donsideration not found" })
        } else {
            const targetOption = targetDonsideration.options.find((option) => option._id == optionId)
            if (!targetOption) {
                return res.status(404).send({ message: "Donsideration option not found" })

            } else {
                const newDonsiderationOptionCon = new Con({
                    content: req.body.content
                })
                targetOption.cons.push(newDonsiderationOptionCon)

                targetDonsideration.options = helpers.replaceItem(targetDonsideration.options, optionId, targetOption)
                plan.donsiderations = helpers.replaceItem(plan.donsiderations, donsiderationId, targetDonsideration)
                plan.save()
                res.send({ newProperty: plan.donsiderations, planId: req.params.pid, propertyType: "donsiderations",message: "Donsideration Option Con successfully added" })
            }
        }
    })

}
exports.updateDonsiderationOptionCon = (req, res) => {
    const planId = req.params.pid
    const donsiderationId = req.params.did
    const optionId = req.params.oid
    const conId = req.params.cid

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
            if (!targetOption) {
                return res.status(404).send({ message: "Donsideration option not found" })
            } else {
                const targetCon = helpers.findCon(targetOption, conId)
                if (!targetCon) {
                    return res.status(404).send({ message: "Donsideration option con not found" })
                } else {
                    for (key in req.body) {
                        if (key === "_id") {
                            return res.status(403).send({ message: "Cannot update object id" })
                        }
                        if (targetCon[key]) {
                            targetCon[key] = req.body[key]
                        } else {
                            return res.status(500).send({ message: "Update failed, invalid key provided" })
                        }
                    }
                }
                targetOption.cons = helpers.replaceItem(targetOption.cons, conId, targetCon)
                targetDonsideration.options = helpers.replaceItem(targetDonsideration.options, optionId, targetOption)
                plan.donsiderations = helpers.replaceItem(plan.donsiderations, donsiderationId, targetDonsideration)
                plan.save()
                res.send({ newProperty: plan.donsiderations, planId: req.params.pid, propertyType: "donsiderations",message: "Donsideration option con updated successfully" })
            }
        }

    })
}
exports.removeDonsiderationOptionCon = (req, res) => {
    const planId = req.params.pid
    const donsiderationId = req.params.did
    const optionId = req.params.oid
    const conId = req.params.cid

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
            if (!targetOption) {
                return res.status(404).send({ message: "Donsideration option not found" })
            } else {
                targetOption.cons = targetOption.cons.filter((con) => con._id != conId)
                targetDonsideration.options = helpers.replaceItem(targetDonsideration.options, optionId, targetOption)
                plan.donsiderations = helpers.replaceItem(plan.donsiderations, donsiderationId, targetDonsideration)
                plan.save()
                res.send({ newProperty: plan.donsiderations, planId: req.params.pid, propertyType: "donsiderations",message: "Donsideration option con deleted" })
            }
        }
    })
}