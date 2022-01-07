const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ConSchema = new Schema({
    content: String,
})

const Con = mongoose.model("Con", ConSchema)

module.exports = {Con, ConSchema}