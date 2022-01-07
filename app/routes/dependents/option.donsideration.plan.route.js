const controller = require("../../controllers/dependents/option.donsideration.controller")
const { verifyOwnership, authJwt } = require("../../middleware")

module.exports= (app)=>{
    app.post("/api/plan/donsideration/option/:pid/:did", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.addDonsiderationOption)
    app.put("/api/plan/donsideration/option/:pid/:did/:oid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.updateDonsiderationOption)
    app.delete("/api/plan/donsideration/option/:pid/:did/:oid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.removeDonsiderationOption)
}