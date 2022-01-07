const mongoose = require("mongoose")
const Schema = mongoose.Schema

const StepSchema = new Schema({
    title: String,
    status: Boolean
})

const Step = mongoose.model("Step", StepSchema)

module.exports = {Step, StepSchema}