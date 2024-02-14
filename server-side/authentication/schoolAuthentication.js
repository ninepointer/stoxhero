const jwt = require("jsonwebtoken");
const School = require("../models/School/schoolOnboarding");
const {client, getValue} = require("../marketData/redisClient");
const ObjectId = require('mongodb').ObjectId;


exports.SchoolAuthenticate = async (req, res, next) => {
    let isRedisConnected = getValue();
    let token;

    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers?.authorization?.split(' ')[1];
            console.log("req.headers?.authorization", req.headers?.authorization)
        }

        if (req.cookies && req.cookies.jwtoken) {
            token = req.cookies.jwtoken;
        }

        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        let school;

        if (isRedisConnected && await client.exists(`${verifyToken._id.toString()}schoolauthentication`)) {
            school = await client.get(`${verifyToken._id.toString()}schoolauthentication`);
            school = JSON.parse(school);

            await client.expire(`${verifyToken._id.toString()}schoolauthentication`, 180);
        } else {
            
            school = await School.findOne({ _id: new ObjectId(verifyToken._id), status: "Active" })
                .select('-createdOn -createdBy -lastModifiedBy -lastModifiedOn');

                // console.log(school)
            if (!school) { 
                return res.status(404).json({ status: 'error', message: 'School not found' });
            }
            if (school.changedPasswordAfter(verifyToken.iat)) {
                return res.status(401).send({ status: "error", message: "School recently changed password! Please log in again." });
            }
            if ("isRedisConnected") {
                await client.set(`${verifyToken._id.toString()}schoolauthentication`, JSON.stringify(school));
                await client.expire(`${verifyToken._id.toString()}schoolauthentication`, 180);
            }
        }

        req.user = school;
    } catch (err) {
        console.log("err", err);
        return res.status(401).send({ status: "error", message: "Unauthenticated school" });
    }
    next();
}
