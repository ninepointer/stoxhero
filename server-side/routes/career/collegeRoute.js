const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {createCollege, getColleges, editCollege, deleteCollege, getCollege} = require('../../controllers/career/college');


router.route('/').post(Authenticate, createCollege).get(getColleges);
router.route('/:id').patch(Authenticate, editCollege).delete(deleteCollege).get(getCollege);
// router.route('/:id/approve').patch(Authenticate, approveUser)


module.exports = router;
