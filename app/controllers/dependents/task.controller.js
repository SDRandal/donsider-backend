const db = require("../../models")
const helpers = require("../helpers/plan.helper")
const Plan = db.plan
const Task = db.task

exports.addTask = (req, res) => {
    Plan.findById(req.params.pid, (err, plan) => {
        if (err) {
            return res.status(500).send({ message: "There was an issue locating the requested plan", err })
        }
        if (!plan) {
            return res.status(404).send({ message: "The requested plan does not exist" })
        }

        const newTask = new Task({
            title: req.body.title,
            priority: req.body.priority
        })
        plan.tasks = [...plan.tasks, newTask]
        plan.save()
        res.send({ newProperty: plan.tasks, planId: req.params.pid, propertyType: "tasks",message: "Task added from task controller" })
    })

}
exports.updateTask = (req, res) => {
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
        if(!targetTask){
            return res.status(404).send({ message: "The requested task does not exist" })
        }
        for(key in req.body){
            if(key === "_id"){
                return res.status(403).send({ message: "Cannot update id" })
            }
            if(targetTask[key]){
                targetTask[key] = req.body[key]
            }
        }
        plan.tasks = helpers.replaceItem(plan.tasks, taskId, targetTask)
        plan.save()
        res.send({newProperty: plan.tasks, planId: req.params.pid, propertyType: "tasks",message:"Task successfully updated"})
    })
}
exports.removeTask = (req, res) => {
    const planId = req.params.pid
    const taskId = req.params.tid

    Plan.findById(planId, (err, plan) => {
        if (err) {
            return res.status(500).send({ message: "There was an issue locating the requested plan", err })
        }
        if (!plan) {
            return res.status(404).send({ message: "The requested plan does not exist" })
        }
        plan.tasks = plan.tasks.filter((task)=> {
            // TODO I added this existence check because I somehow ended up with a null record in one of my arrays... I don't think it is possible any longer, but I should test that theory
            if(task){
                return task._id != taskId
            }
        })
        plan.save()
        res.send({newProperty: plan.tasks, planId: req.params.pid, propertyType: "tasks",message:"Task successfully deleted"})
    })
 }