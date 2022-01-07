const mongoose = require("mongoose")
const Schema = mongoose.Schema

const NoteSchema = new Schema({
    content: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    time: Date,
    edited: Boolean
})

const Note = mongoose.model("Note", NoteSchema)

module.exports = {Note, NoteSchema}