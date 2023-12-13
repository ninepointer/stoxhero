const express = require("express");
const router = express.Router();
require("../../db/conn");
const SearchInstrument = require("../../controllers/TradableInstrument/searchInstrument")
const authentication = require("../../authentication/authentication")
const restrictTo = require('../../authentication/authorization');

router.get("/tradableInstruments", authentication, async (req, res)=>{
    const input = req.query.search;
    await SearchInstrument.search(input, res, req)
})

router.get("/equityInstrument", authentication, async (req, res)=>{
    const input = req.query.search;
    await SearchInstrument.equitySearch(input, res, req)
})


module.exports = router;