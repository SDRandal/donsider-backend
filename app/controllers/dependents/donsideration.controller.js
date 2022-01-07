const { plan, donsideration } = require("../../models")
const db = require("../../models")
const Plan = db.plan
const Donsideration = db.donsideration

exports.addDonsideration = (req, res) => {
    Plan.findById(req.params.pid, (err, plan) => {
        if (err) {
            return res.status(500).send({ message: "There was an issue locating the requested plan", err })
        }
        if (!plan) {
            return res.status(404).send({ message: "The requested plan does not exist" })
        }
        const newDonsideration = new Donsideration({
            title: req.body.title,
            status: true,
            options: []
        })

        plan.donsiderations = [...plan.donsiderations, newDonsideration]
        plan.save()
        res.send({ newProperty: plan.donsiderations, planId: req.params.pid, propertyType: "donsiderations",message: "Donsideration successfully added" })

    })

}
exports.updateDonsideration = (req, res) => {
    const planId = req.params.pid
    const donsiderationId = req.params.did

    Plan.findById(planId, (err, plan) => {
        if (err) {
            return res.status(500).send({ message: "There was an issue locating the requested plan", err })
        }
        if (!plan) {
            return res.status(404).send({ message: "The requested plan does not exist" })
        }
        // TODO I think an alternative to this technique would be to somehow just copy the donsideration entirely, butidk how to do that

        const targetDonsideration = plan.donsiderations.find((donsideration) => {
            return donsideration._id == donsiderationId
        })
        if(!targetDonsideration){
            return res.status(404).send({message:"Donsideration not found"})
        }else{
            for (key in req.body) {
                if (key === "_id") {
                    return res.status(403).send({ message: "Cannot update object id" })
                }
                if (targetDonsideration[key]) {
                    targetDonsideration[key] = req.body[key]
                } else {
                    return res.status(500).send({ message: "Update failed, invalid key provided" })
                }
            }
            const newDonsiderationsArray = plan.donsiderations.map((donsideration) => {
                if (donsideration._id == donsiderationId) {
                    return donsideration = targetDonsideration
                } else {
                    return donsideration
                }
            })
            if (newDonsiderationsArray) {
                plan.donsiderations = newDonsiderationsArray
                plan.save()
    
            }
            res.send({newProperty: plan.donsiderations, planId: req.params.pid, propertyType: "donsiderations",message: "Donsideration successfully updated" })

        }
    })

}
exports.removeDonsideration = (req, res) => {
    // TODO There needs to be some standardization put in place. There are some controllers where I use a var for planId and othere where I don't
    // I am also using req.params.id for the id that I sendback to the client. That should be consistent as well
    const planId = req.params.pid
    const donsiderationId = req.params.did

    Plan.findById(planId, (err, plan) => {
        if (err) {
            return res.status(500).send({ message: "There was an issue locating the requested plan", err })
        }
        if (!plan) {
            return res.status(404).send({ message: "The requested plan does not exist" })
        }        
        plan.donsiderations = plan.donsiderations.filter((donsideration) => {
            if (donsideration) {
                return donsideration._id != donsiderationId
            }
        })
        plan.save()
        res.send({ newProperty: plan.donsiderations, planId: req.params.pid, propertyType: "donsiderations",message: "Donsideration successfully removed" })
    })
}