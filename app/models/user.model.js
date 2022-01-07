const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: String,
    password: String,
    avatarUrl: String,
    roles: [
        {
            type: Schema.Types.ObjectId,
            ref: "Role"
        }
    ],
    plans:[{
        type:Schema.Types.ObjectId,
        ref:"Plan"
    }]
})

const User = mongoose.model("User", UserSchema)

module.exports = User