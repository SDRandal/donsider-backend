const db = require("../../models")
const helpers = require("../../controllers/helpers/plan.helper")
const Plan = db.plan
const Pro = db.donsideration.option.pro

exports.addDonsiderationOptionPro = (req, res) => {
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
                const newDonsiderationOptionPro = new Pro({
                    content: req.body.content
                })
                targetOption.pros.push(newDonsiderationOptionPro)

                targetDonsideration.options = helpers.replaceItem(targetDonsideration.options, optionId, targetOption)
                plan.donsiderations = helpers.replaceItem(plan.donsiderations, donsiderationId, targetDonsideration)
                plan.save()
                res.send({ newProperty: plan.donsiderations, planId: req.params.pid, propertyType: "donsiderations",message: "Donsideration Option Pro successfully added" })
            }
        }
    })

}
exports.updateDonsiderationOptionPro = (req, res) => {
    const planId = req.params.pid
    const donsiderationId = req.params.did
    const optionId = req.params.oid
    const proId = req.params.prid

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
                const targetPro = helpers.findPro(targetOption, proId)
                if (!targetPro) {
                    return res.status(404).send({ message: "Donsideration option pro not found" })
                } else {
                    for (key in req.body) {
                        if (key === "_id") {
                            return res.status(403).send({ message: "Cannot update object id" })
                        }
                        if (targetPro[key]) {
                            targetPro[key] = req.body[key]
                        } else {
                            return res.status(500).send({ message: "Update failed, invalid key provided" })
                        }
                    }
                }
                targetOption.pros = helpers.replaceItem(targetOption.pros, proId, targetPro)
                targetDonsideration.options = helpers.replaceItem(targetDonsideration.options, optionId, targetOption)
                plan.donsiderations = helpers.replaceItem(plan.donsiderations, donsiderationId, targetDonsideration)
                plan.save()
                res.send({ newProperty: plan.donsiderations, planId: req.params.pid, propertyType: "donsiderations",message: "Donsideration option pro updated successfully" })
            }
        }

    })
}
exports.removeDonsiderationOptionPro = (req, res) => {
    const planId = req.params.pid
    const donsiderationId = req.params.did
    const optionId = req.params.oid
    const proId = req.params.prid

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
                targetOption.pros = targetOption.pros.filter((pro) => pro._id != proId)
                targetDonsideration.options = helpers.replaceItem(targetDonsideration.options, optionId, targetOption)
                plan.donsiderations = helpers.replaceItem(plan.donsiderations, donsiderationId, targetDonsideration)
                plan.save()
                res.send({ newProperty: plan.donsiderations, planId: req.params.pid, propertyType: "donsiderations",message: "Donsideration option pro deleted" })

            }
        }
    })
}