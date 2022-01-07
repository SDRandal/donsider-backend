const {DonsiderationOptionSchema} = require("./donsideration-option.model")

const mongoose = require("mongoose")
const Schema = mongoose.Schema

const DonsiderationSchema = new Schema({
    title: String,
    options:[DonsiderationOptionSchema],
    status: Boolean
})

const Donsideration = mongoose.model("Donsideration", DonsiderationSchema)

module.exports = {Donsideration, DonsiderationSchema}