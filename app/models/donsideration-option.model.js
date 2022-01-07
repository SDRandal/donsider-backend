const {ProSchema} = require("./pro.model")
const {ConSchema} = require("./con.model")

const mongoose = require("mongoose")
const Schema = mongoose.Schema

const DonsiderationOptionSchema = new Schema({
    content: String,
    pros: [ProSchema],
    cons: [ConSchema]
})

const DonsiderationOption = mongoose.model("DonsiderationOption", DonsiderationOptionSchema)

module.exports = {DonsiderationOption, DonsiderationOptionSchema}