const controller = require("../../controllers/dependents/con.option.donsideration.controller")
const { verifyOwnership, authJwt } = require("../../middleware")

module.exports= (app)=>{
    app.post("/api/plan/donsideration/option/con/:pid/:did/:oid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.addDonsiderationOptionCon)
    app.put("/api/plan/donsideration/option/con/:pid/:did/:oid/:cid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.updateDonsiderationOptionCon)
    app.delete("/api/plan/donsideration/option/con/:pid/:did/:oid/:cid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.removeDonsiderationOptionCon)
}