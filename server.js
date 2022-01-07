const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()
// Why did they use var instead of const or let here?
var corsOptions = {
    // origin: "http://192.168.1.166:3000"
    origin: "http://localhost:3000",
    credentials: true
}

app.use(cors(corsOptions))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const db = require("./app/models")
const dbConfig = require("./app/config/db.config")
const Role = db.role


db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to MongoDB")
        initial()
    })

// Routes
app.use(function (req, res, next) {
    //Does it make sense to just put this here? or should I only place it on routes that are protected?
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    )
    next()
})
// require('./app/routes/test.routes')(app)
require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)
require('./app/routes/plan.routes')(app)

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save((err) => {
                if (err) {
                    console.log("Error creating role 'user'")
                }
                console.log("New role 'user' added to roles collection")
            })

            new Role({
                name: "moderator"
            }).save((err) => {
                if (err) {
                    console.log("Error creating role 'moderator'")
                }
                console.log("New role 'moderator' added to roles collection")
            })

            new Role({
                name: "admin"
            }).save((err) => {
                if (err) {
                    console.log("Error creating role 'admin'")
                }
                console.log("New role 'admin' added to roles collection")
            })
        }
    })
}

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log("Server is running on port", PORT)
})