const controller = require("../../controllers/dependents/pro.option.donsideration.controller")
const { verifyOwnership, authJwt } = require("../../middleware")

module.exports= (app)=>{
    app.post("/api/plan/donsideration/option/pro/:pid/:did/:oid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.addDonsiderationOptionPro)
    app.put("/api/plan/donsideration/option/pro/:pid/:did/:oid/:prid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.updateDonsiderationOptionPro)
    app.delete("/api/plan/donsideration/option/pro/:pid/:did/:oid/:prid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.removeDonsiderationOptionPro)
}