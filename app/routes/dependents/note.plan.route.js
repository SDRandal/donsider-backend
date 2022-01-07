const controller = require("../../controllers/dependents/note.controller")
const { verifyOwnership, authJwt } = require("../../middleware")

module.exports= (app)=>{
    app.post("/api/plan/note/:pid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.addNote)
    app.put("/api/plan/note/:pid/:nid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.updateNote)
    app.delete("/api/plan/note/:pid/:nid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.removeNote)
}