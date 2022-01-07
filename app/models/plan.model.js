const { TaskSchema } = require("./task.model")
const { NoteSchema } = require("./note.model")
const { DonsiderationSchema } = require("./donsideration.model")
const { AttachmentSchema } = require("./attachment.model")
const { TagSchema } = require("./tag.model")
const User = require("./user.model")

const mongoose = require("mongoose")
const Schema = mongoose.Schema
// TODO I probably need to add some field size limits to these
const PlanSchema = new Schema({
    title: String,
    goal: String,
    users: [{
        _id:
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        avatarUrl: String
    }
    ],
    tasks: [TaskSchema],
    notes: [NoteSchema],
    donsiderations: [DonsiderationSchema],
    priority: String,
    attachments: [AttachmentSchema],
    tags: [TagSchema],
    createDate: Date,
    dueDate: Date
})

PlanSchema.pre("remove", (next) => {
    const users = this.users


    next()
})

const Plan = mongoose.model("Plan", PlanSchema)

module.exports = Plan