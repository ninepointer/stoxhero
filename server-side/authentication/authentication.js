const jwt = require("jsonwebtoken");
const User = require("../models/User/userDetailSchema");

const Authenticate = async (req, res, next)=>{
    let now = performance.now();
    try{

        
        const token = req.cookies.jwtoken;
        console.log("token fetching", performace.now()-now)
        if(!token) console.log('token nahi hai');
        if(token) console.log('token hai')
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        console.log("verify", performace.now()-now)
        const user = await User.findOne({_id: verifyToken._id}).populate('role', 'roleName');
        console.log("user", performace.now()-now)
        if(!user){ throw new Error("User not found")}

        req.token = token;
        req.user = user;

    } catch(err){
        return res.status(401).send({status: "error", message: "Unauthenthicated"})
    }
    console.log("in auth", performance.now()-now)
    next();
}

module.exports = Authenticate;