const { StepSchema } = require("./step.model")

const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TaskSchema = new Schema({
    title: String,
    steps:[StepSchema],
    priority: String
})

const Task = mongoose.model("Task", TaskSchema)

module.exports = {Task, TaskSchema}
