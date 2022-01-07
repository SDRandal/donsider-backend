const jwt = require("jsonwebtoken")
const config = require("../config/auth.config")
const db = require("../models")
const User = db.User
const Role = db.role

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"]

    if(!token){
        return res.status(403).send({message: "No token present in request"})
    }

    jwt.verify(token, config.secret, (err, decoded)=>{
        if(err){
            return res.status(401).send({message: "Unauthorized"})
        }
        req.userId = decoded.id
        next()
    })
}

isAdmin = (req, res, next)=> {
    User.findById(req.userId).exec((err, user)=> {
        if(err){
            // TODO Why isn't this return res.status... ? 
            return res.status(500).send({message:err})
        }
        Role.find(
            {
                _id: {$in: user.roles}
            },
            (err, roles) => {
                if(err){
                    return res.status(500).send({message: err})
                }
                for(let i = 0; i < roles.length; i++){
                    if(roles[i].name === "admin"){
                        next()
                        return
                    }
                }
                res.status(403).send({message:"Not Autorized"})
            }
        )
    })
}

isModerator = (req, res, next)=> {
    User.findById(req.userId).exec((err, user)=> {
        if(err){
            // TODO Why isn't this return res.status... ? 
            return res.status(500).send({message:err})
        }
        Role.find(
            {
                _id: {$in: user.roles}
            },
            (err, roles) => {
                if(err){
                    return res.status(500).send({message: err})
                }
                for(let i = 0; i < roles.length; i++){
                    if(roles[i].name === "moderator"){
                        next()
                        return
                    }
                }
                return res.status(403).send({message:"Not Autorized"})
            }
        )
    })
}

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator
}

module.exports = authJwt