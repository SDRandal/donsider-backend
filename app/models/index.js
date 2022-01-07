const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const db = {}

db.mongoose = mongoose

db.user = require("./user.model")
db.role = require("./role.model")
db.plan = require("./plan.model")
db.task = require("./task.model").Task
db.step = require("./step.model").Step
db.tag = require("./tag.model").Tag
db.attachment = require("./attachment.model").Attachment
db.note = require("./note.model").Note
db.donsideration = require("./donsideration.model").Donsideration
db.donsideration.option = require("./donsideration-option.model").DonsiderationOption
db.donsideration.option.pro = require("./pro.model").Pro
db.donsideration.option.con = require("./con.model").Con

db.ROLES = ["user", "admin", "moderator"]

module.exports = db
