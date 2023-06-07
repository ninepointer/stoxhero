const express = require("express");
const router = express.Router();
require("../../db/conn");
const SearchInstrument = require("../../controllers/TradableInstrument/searchInstrument")
const authentication = require("../../authentication/authentication")

router.get("/tradableInstruments", authentication, async (req, res)=>{
    const input = req.query.search;
    await SearchInstrument.search(input, res, req)
})


module.exports = router;