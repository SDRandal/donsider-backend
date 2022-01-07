const controller = require("../../controllers/dependents/donsideration.controller")
const { verifyOwnership, authJwt } = require("../../middleware")

module.exports= (app)=>{
    app.post("/api/plan/donsideration/:pid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.addDonsideration)
    app.put("/api/plan/donsideration/:pid/:did", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.updateDonsideration)
    app.delete("/api/plan/donsideration/:pid/:did", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.removeDonsideration)
}