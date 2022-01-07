const controller = require("../../controllers/dependents/task.controller")
const { verifyOwnership, authJwt } = require("../../middleware")
// TODO There has to be a less intensive way to run the verifyOwnership middleware on every route that requests part of a plan right?
module.exports= (app)=>{
    app.post("/api/plan/task/:pid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.addTask)
    app.put("/api/plan/task/:pid/:tid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.updateTask)
    app.delete("/api/plan/task/:pid/:tid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.removeTask)
}