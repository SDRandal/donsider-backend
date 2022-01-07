const mongoose = require("mongoose")
const Schema = mongoose.Schema

const AttachmentSchema = new Schema({
    displayName: String,
    temp: String,
    fileType: String,
    persistentFileName: String
})

const Attachment = mongoose.model("Attachment", AttachmentSchema)

module.exports = {Attachment, AttachmentSchema}