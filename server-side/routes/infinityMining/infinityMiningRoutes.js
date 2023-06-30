const express = require("express");
const router = express.Router({mergeParams: true});
const {getTraderStats} = require('../../controllers/infinityMiningController');

const Authenticate = require('../../authentication/authentication');


router.route('/traderstats/:id').get(getTraderStats);



module.exports = router;