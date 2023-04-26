const jwt = require("jsonwebtoken");
const User = require("../models/User/userDetailSchema");

const Authenticate = async (req, res, next)=>{
    try{

        const token = req.cookies.jwtoken;
        if(!token) console.log('token nahi hai');
        if(token) console.log('token hai')
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findOne({_id: verifyToken._id}).populate('role', 'roleName');

        if(!user){ throw new Error("User not found")}

        req.token = token;
        req.user = user;

    } catch(err){
        return res.status(401).send("Unauthenthicated")
    }
    next();
}

module.exports = Authenticate;