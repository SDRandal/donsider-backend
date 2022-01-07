const db = require("../../models")
const helpers = require("../helpers/plan.helper")
const Plan = db.plan
const Note = db.note

exports.addNote = (req, res) => {
    Plan.findById(req.params.pid, (err, plan) => {
        if (err) {
            return res.status(500).send({ message: "There was an issue locating the requested plan", err })
        }
        if (!plan) {
            return res.status(404).send({ message: "The requested plan does not exist" })
        }

        const newNote = new Note({
            content: req.body.content,
            user: req.userId,
            time: new Date(),
            edited: false
        })
        plan.notes.push(newNote)
        plan.save()
        res.send({ newProperty: plan.notes, planId: req.params.pid, propertyType: "notes",message: "Plan added from note controller" })
    })

}
exports.updateNote = (req, res) => { 
    // TODO Make sure that user is not updateable somehow.
    const planId = req.params.pid
    const noteId = req.params.nid

    Plan.findById(planId, (err, plan)=> {
        if (err) {
            return res.status(500).send({ message: "There was an issue locating the requested plan", err })
        }
        if (!plan) {
            return res.status(404).send({ message: "The requested plan does not exist" })
        }
        const targetNote = plan.notes.find((note)=> note._id == noteId)
        if(!targetNote){
            return res.status(404).send({ message: "The requested note does not exist" })
        }else{
            for(key in req.body){
                if(key == "_id"){
                    return res.status(403).send({ message: "Cannot update id of item" })
                }
                if(key == "users"){
                    return res.status(403).send({ message: "Cannot update users of item" })
                }
                if(targetNote[key]){
                    targetNote[key] = req.body[key]
                }
            }
            plan.notes = helpers.replaceItem(plan.notes, noteId, targetNote)
            plan.save()
            res.send({newProperty: plan.notes, planId: req.params.pid, propertyType: "notes",message: "Note updated from notes controller" })
        }

    })
}
exports.removeNote = (req, res) => {
    const planId = req.params.pid
    const noteId = req.params.nid

    Plan.findById(planId, (err, plan)=> {
        if (err) {
            return res.status(500).send({ message: "There was an issue locating the requested plan", err })
        }
        if (!plan) {
            return res.status(404).send({ message: "The requested plan does not exist" })
        }
        plan.notes = plan.notes.filter((note) => note._id != noteId)
        plan.save()
        res.send({newProperty: plan.notes, planId: req.params.pid, propertyType: "notes",message:"Note deleted successfully"})
    })
 }