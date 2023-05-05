const jwt = require("jsonwebtoken");
const User = require("../models/User/userDetailSchema");
const client = require("../marketData/redisClient");

const Authenticate = async (req, res, next)=>{
    let now = performance.now();
    try{

        
        const token = req.cookies.jwtoken;
        // console.log("token fetching", performace.now()-now)
        if(!token) console.log('token nahi hai');
        if(token) console.log('token hai')
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);


        try{
            if(await client.exists(`${verifyToken._id.toString()}authenticatedUser`)){
                let user = await client.get(`${verifyToken._id.toString()}authenticatedUser`)
                user = JSON.parse(user);
                // await client.expire(`${verifyToken._id.toString()}authenticatedUser`, 10);
                req.user = user;
            }
            else{
                const user = await User.findOne({_id: verifyToken._id}).populate('role', 'roleName');
                await client.set(`${verifyToken._id.toString()}authenticatedUser`, JSON.stringify(user));
                await client.expire(`${verifyToken._id.toString()}authenticatedUser`, 30);
                req.user = user;
            }
          }catch(e){
            console.log("redis error", e);
          }

    } catch(err){
        return res.status(401).send({status: "error", message: "Unauthenthicated"})
    }
    console.log("in auth", performance.now()-now)
    next();
}

module.exports = Authenticate;