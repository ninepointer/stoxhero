const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

// STAGINGDB
const DB = process.env.DATABASE;
const devDB = process.env.DEVDATABASE;
const stagingDB = process.env.STAGINGDB;
const infinityDB = process.env.INFINITYDB;

    // mongoose.connect(devDB, {
         mongoose.connect(DB, {
        // mongoose.connect(stagingDB, {
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
1. unrealised pnl
2. margin required
3. sell side margin block
4. Used margin me block amount ko dikhana h.
*/