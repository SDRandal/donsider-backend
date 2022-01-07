const controller = require("../../controllers/dependents/step.task.controller")
const { verifyOwnership, authJwt } = require("../../middleware")

module.exports = (app) => {
    app.post("/api/plan/task/step/:pid/:tid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.addStep)
    app.put("/api/plan/task/step/:pid/:tid/:sid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.updateStep)
    app.delete("/api/plan/task/step/:pid/:tid/:sid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.removeStep)
}