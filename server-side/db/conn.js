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

2. Multiple days contest
    a. payout option (lastday or daily)
    b. payout backend integration
    c. In trading screen, all days pnl and cumm pnl
    d. leaderboard as daily and cumm.
    e. After complete show
    f. payout feild as array

*/