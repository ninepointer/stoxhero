const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const MarginxUser = require('../../controllers/marginX/marginxUserWeb');

router.get('/upcoming', Authenticate, MarginxUser.upcoming );
router.get('/live', Authenticate, MarginxUser.live);
router.get('/completed', Authenticate, MarginxUser.completed);
router.get('/live/:id', Authenticate, MarginxUser.getLiveById);


module.exports=router;