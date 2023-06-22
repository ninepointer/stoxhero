const express = require("express");
const router = express.Router({mergeParams: true});
const {optionChain} = require('../../marketData/earlySubscribeInstrument');

const Authenticate = require('../../authentication/authentication');


router.route('/:index').get(optionChain)



module.exports = router;