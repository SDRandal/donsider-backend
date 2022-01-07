const User = require("../models/user.model")

exports.allAccess = (req, res)=> {
    return res.status(200).send("Public Content")
}
exports.userBoard = (req, res)=> {
    return res.status(200).send("User Content")
}
exports.adminBoard = (req, res) => {
    return res.status(200).send("Admin Content")
}
exports.moderatorBoard = (req, res) => {
    return res.status(200).send("Moderator Content")
}
exports.update = (req, res) =>{

}

exports.getAvatar = (req, res)=>{
    const uid = req.params.uid
    User.findById(uid, (err, user)=>{
        if(err){
            res.status(500).send({message: "User not found with the supplied id", err})
        }
        res.send({avatarUrl: user.avatarUrl})
    })
}