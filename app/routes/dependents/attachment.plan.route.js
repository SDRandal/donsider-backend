const multer  = require("multer")
const uuid = require("uuid")

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
        cb(null, uuid.v4().toString() + "-" + file.originalname)
    }
})

const upload = multer({storage})

const controller = require("../../controllers/dependents/attachment.controller")
const { verifyOwnership, authJwt } = require("../../middleware")

module.exports= (app)=>{

    // app.post("/api/plan/attachment/:pid", upload.single('file'), controller.addAttachment)
    app.get("/api/plan/attachment/:pid/:aid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.requestLink)
    app.post("/api/plan/attachment/:pid/", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById, upload.single('file')], controller.addAttachment)
    app.delete("/api/plan/attachment/:pid/:aid", [authJwt.verifyToken, verifyOwnership.userOwnsPlanById], controller.removeAttachment)
}