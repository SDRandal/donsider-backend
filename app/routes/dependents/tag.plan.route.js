const controller = require("../../controllers/dependents/tag.controller")   
const { verifyOwnership, authJwt } = require("../../middleware")

module.exports = (app) => {
    app.post("/api/plan/tag/:pid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.addTag)
    app.put("/api/plan/tag/:pid/:tagId", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.updateTag)
    app.delete("/api/plan/tag/:pid/:tagId", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.removeTag)
}