const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ProSchema = new Schema({
    content: String,
})

const Pro = mongoose.model("Pro", ProSchema)

module.exports = {Pro, ProSchema}