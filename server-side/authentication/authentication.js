const jwt = require("jsonwebtoken");
const User = require("../models/User/userDetailSchema");
const {client, getValue} = require("../marketData/redisClient");
const { ObjectId } = require("bson");


const Authenticate = async (req, res, next) => {
    let isRedisConnected = getValue();
    let token;
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers?.authorization?.split(' ')[1];
        }

        if (req.cookies && req.cookies.jwtoken) {
            token = req.cookies.jwtoken;
        }

        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        let user;

        if (isRedisConnected && await client.exists(`${verifyToken._id.toString()}authenticatedUser`)) {
            user = await client.get(`${verifyToken._id.toString()}authenticatedUser`);
            user = JSON.parse(user);
            user._id = new ObjectId(user._id);
            await client.expire(`${verifyToken._id.toString()}authenticatedUser`, 180);
            if(new Date(user?.passwordChangedAt)>new Date(verifyToken?.iat)){
                console.log('password changed');
            }
        } else {
            
            user = await User.findOne({ _id: new ObjectId(verifyToken._id), status: "Active" })
                .select('_id employeeid first_name last_name mobile name role isAlgoTrader passwordChangedAt');

            if (!user) { 
                return res.status(404).json({ status: 'error', message: 'User not found' });
            }
            if (user.changedPasswordAfter(verifyToken.iat)) {
                return res.status(401).send({ status: "error", message: "User recently changed password! Please log in again." });
            }
            if ("isRedisConnected") {
                await client.set(`${verifyToken._id.toString()}authenticatedUser`, JSON.stringify(user));
                await client.expire(`${verifyToken._id.toString()}authenticatedUser`, 180);
            }
        }

        req.user = user;
    } catch (err) {
        console.log("err", err);
        return res.status(401).send({ status: "error", message: "Unauthenticated" });
    }
    next();
}


module.exports = Authenticate;


// _id, first_name, last_name, mobile, role, isAlgoTrader, name, employeeid