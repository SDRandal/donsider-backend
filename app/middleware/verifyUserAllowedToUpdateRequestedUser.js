const db = require("../models")

const User  = db.user

module.exports = (req, res, next) =>{

    const paramUserId = req.params.uid
    User.findById(req.userId, (err, user)=>{
        if(paramUserId != user._id){
            res.status(403).send({message: "Fobidden"})
        }else{
            next()
        }

    })

}