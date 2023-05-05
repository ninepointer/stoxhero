const jwt = require("jsonwebtoken");
const User = require("../models/User/userDetailSchema");

const Authenticate = async (req, res, next)=>{
    let token;
    try{
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    // console.log((req ))
    if (req.cookies) {
        if(req.cookies.jwtoken) token = req.cookies.jwtoken;
    }
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({_id: verifyToken._id}).populate('role', 'roleName');
        if(!user){ return res.status(404).json({status:'error', message: 'User not found'})}

        req.token = token;
        req.user = user;

    } catch(err){
        return res.status(401).send({status: "error", message: "Unauthenthicated"});
    }
    next();
}

module.exports = Authenticate;