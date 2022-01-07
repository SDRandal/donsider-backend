const db = require("../../models")
const helpers = require("../helpers/plan.helper")
const Plan = db.plan
const Step = db.step

exports.addStep = (req, res) => {
    const planId = req.params.pid
    const taskId = req.params.tid

    Plan.findById(planId, (err, plan) => {
        if (err) {
            return res.status(500).send({ message: "There was an issue locating the requested plan", err })
        }
        if (!plan) {
            return res.status(404).send({ message: "The requested plan does not exist" })
        }
        const targetTask = plan.tasks.find((task) => task._id == taskId)

        if(targetTask){
            const newStep = new Step({
                title: req.body.title,
                status: false
            })
            targetTask.steps.push(newStep)
    
            plan.tasks = helpers.replaceItem(plan.tasks, taskId, targetTask)
            plan.save()
            res.send({ newProperty: plan.tasks, planId: req.params.pid, propertyType: "tasks",message: "Step successfully added" })

        }else{
            res.status(404).send({message: "Task not found"})
        }
    })
}
exports.updateStep = (req, res) => {
    console.log(req.body)
    const planId = req.params.pid
    const taskId = req.params.tid
    const stepId = req.params.sid

    Plan.findById(planId, (err, plan) => {
        if (err) {
            return res.status(500).send({ message: "There was an issue locating the requested plan", err })
        }
        if (!plan) {
            return res.status(404).send({ message: "The requested plan does not exist" })
        }
        const targetTask = plan.tasks.find((task) => task._id == taskId)

        if (!targetTask) {
            return res.status(404).send({ message: "The requested task does not exist" })
        } else {
            const targetStep = targetTask.steps.find((step) => step._id == stepId)
            if (!targetStep) {
                return res.status(404).send({ message: "The requested step does not exist" })
            } else {
                for (key in req.body) {
                    if (key === "_id") {
                        // return res.status(403).send({ message: "Cannot update id of item" })
                    }else if (Object.keys(targetStep._doc).includes(key)) {
                        targetStep[key] = req.body[key]
                        // console.log(targetStep)
                    }
                }
                targetTask.steps = helpers.replaceItem(targetTask.steps, stepId, targetStep)
                plan.tasks = helpers.replaceItem(plan.tasks, taskId, targetTask)
                plan.save()
                res.send({newProperty: plan.tasks, planId: req.params.pid, propertyType: "tasks",message: "Step updated from step controller" })

            }
        }
    })
}
exports.removeStep = (req, res) => {
    const planId = req.params.pid
    const taskId = req.params.tid
    const stepId = req.params.sid

    Plan.findById(planId, (err, plan) => {
        if (err) {
            return res.status(500).send({ message: "There was an issue locating the requested plan", err })
        }
        if (!plan) {
            return res.status(404).send({ message: "The requested plan does not exist" })
        }
        const targetTask = plan.tasks.find((task) => task._id == taskId)
        if (!targetTask) {
            return res.status(404).send({ message: "The requested task does not exist" })
        }
        targetTask.steps = targetTask.steps.filter((step) => step._id != stepId)

        plan.tasks = helpers.replaceItem(plan.tasks, taskId, targetTask)
        plan.save()
        res.send({newProperty: plan.tasks, planId: req.params.pid, propertyType: "tasks",message: "Task successfully deleted" })

    })

}