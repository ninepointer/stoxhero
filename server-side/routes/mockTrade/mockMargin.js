const express = require("express");
const router = express.Router({mergeParams: true});
const {infinityMargin} = require('../../controllers/mockMargin');
const Authenticate = require('../../authentication/authentication');



router.route('/infinity').get( infinityMargin)


module.exports = router;