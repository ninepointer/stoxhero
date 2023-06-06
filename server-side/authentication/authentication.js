const jwt = require("jsonwebtoken");
const User = require("../models/User/userDetailSchema");
const {client, getValue} = require("../marketData/redisClient");
const { ObjectId } = require("bson");


const Authenticate = async (req, res, next)=>{
    let isRedisConnected = getValue();
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
        // console.log("Token: ",req.cookies.jwtoken)
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        // console.log('verify token',verifyToken);

        try{
            // console.log("above authentication", isRedisConnected, getValue());
            // console.log("check",  client.exists(`${verifyToken._id.toString()}authenticatedUser`))
            if(isRedisConnected && await client.exists(`${verifyToken._id.toString()}authenticatedUser`)){
                // console.log("in authentication if")
                let user = await client.get(`${verifyToken._id.toString()}authenticatedUser`)
                user = JSON.parse(user);
                // await client.expire(`${verifyToken._id.toString()}authenticatedUser`, 10);
                user._id = new ObjectId(user._id)
                req.user = user;
            }
            
            else{

                // console.log("in else authentication")
                const user = await User.findOne({_id: verifyToken._id, status: "Active"})
                .select('_id employeeid first_name last_name mobile name role isAlgoTrader')
                
                if(!user){ return res.status(404).json({status:'error', message: 'User not found'})}

                // console.log("abobe redis")
                if(isRedisConnected){
                    await client.set(`${verifyToken._id.toString()}authenticatedUser`, JSON.stringify(user));
                    await client.expire(`${verifyToken._id.toString()}authenticatedUser`, 30);    
                }
                // console.log("below redis")
                req.user = user;
            }
          }catch(e){
            console.log("redis error", e);
          }

    } catch(err){
        console.log("err", err)
        return res.status(401).send({status: "error", message: "Unauthenthicated"});
    }
    next();
}

module.exports = Authenticate;


// _id, first_name, last_name, mobile, role, isAlgoTrader, name, employeeid