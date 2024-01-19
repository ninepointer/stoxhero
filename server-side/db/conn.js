const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

// STAGINGDB
const DB = process.env.DATABASE;
const devDB = process.env.DEVDATABASE;
const stagingDB = process.env.STAGINGDB;
const infinityDB = process.env.INFINITYDB;

    // mongoose.connect(devDB, {
        // mongoose.connect(DB, {
         mongoose.connect(stagingDB, {
        // mongoose.connect(infinityDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false

}).then(() => {
    console.log("connection secure");
}).catch((err) => {
    console.log(err);
    console.log("no connection");
})

/*
1. affiliate signups entry in affiliate referrals, user and programme
2. old affiliate signups entry in transaction collection
3. herody3 documents entry in affiliate referral(user and programme), transaction, wallet transaction
4. in affiliate referral add joining comission.
5. add joining comission to all referral
6. add joining_time in referrals
*/