const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {createCollege, getCentralZoneColleges, getNorthZoneColleges,
     getSouthZoneColleges, getEastZoneColleges, getWestZoneColleges,
     getColleges, editCollege, deleteCollege, getCollege} = require('../../controllers/career/college');


router.route('/').post(Authenticate, createCollege).get(getColleges);
router.route('/central').get(Authenticate, getCentralZoneColleges);
router.route('/north').get(Authenticate, getNorthZoneColleges);
router.route('/south').get(Authenticate, getSouthZoneColleges);
router.route('/east').get(Authenticate, getEastZoneColleges);
router.route('/west').get(Authenticate, getWestZoneColleges);
router.route('/delete/:id').patch(Authenticate, deleteCollege);
router.route('/:id').patch(Authenticate, editCollege).get(getCollege);

// router.route('/:id/approve').patch(Authenticate, approveUser)


module.exports = router;
