const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TargetSchema = new Schema({
    id: Schema.Types.ObjectId,
    targetType : String
})


const EventSchema = new Schema({
    type: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User" // This needs to be a reference, because I will need the users name. If I "embed" this, and the users name changes, the name will not match
    },
    target: TargetSchema // Do I need to create a model for this? 


})

const Event = mongoose.model("Event", EventSchema)

module.exports = Event