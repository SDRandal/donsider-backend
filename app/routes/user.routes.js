const {authJwt} = require("../middleware")
const controller = require("../controllers/user.controller")
const verifyUserAllowedToUpdateRequestedUser = require("../middleware/verifyUserAllowedToUpdateRequestedUser")

module.exports = function(app){

    // TODO Verifying the token here only checks if the user is signed in, not if the have the auth to change user info. There should be a check for if the user has an admin role or an id that matches the uid
    app.put("/api/user/:uid", [authJwt.verifyToken, verifyUserAllowedToUpdateRequestedUser], controller.update)

    app.get("api/user/profile/avatar/:uid", [authJwt.verifyToken], controller.getAvatar)

}