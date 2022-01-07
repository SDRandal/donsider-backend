const { verifyOwnership, authJwt } = require("../middleware")
const controller = require("../controllers/plan.contoller")
const {setCookies} = require("../middleware/setCookies")

module.exports = (app) => {
    // TODO 
    app.post("/api/plan", [authJwt.verifyToken], controller.create)
    app.get("/api/plan/:pid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.read)
    app.put("/api/plan/:pid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.update)
    app.delete("/api/plan/:pid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.delete)
    app.get("/api/plans", [authJwt.verifyToken], controller.all)

    //add plan dependents routes
    require("./dependents")(app)

}