const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {createCollege, getCentralZoneColleges, getNorthZoneColleges,
     getSouthZoneColleges, getEastZoneColleges, getWestZoneColleges,
     getColleges, editCollege, deleteCollege, getCollege} = require('../../controllers/career/college');


router.route('/').post(Authenticate, createCollege).get(getColleges);
router.route('/central').post(Authenticate, createCollege).get(getCentralZoneColleges);
router.route('/north').post(Authenticate, createCollege).get(getNorthZoneColleges);
router.route('/south').post(Authenticate, createCollege).get(getSouthZoneColleges);
router.route('/east').post(Authenticate, createCollege).get(getEastZoneColleges);
router.route('/west').post(Authenticate, createCollege).get(getWestZoneColleges);

router.route('/:id').patch(Authenticate, editCollege).delete(deleteCollege).get(getCollege);
// router.route('/:id/approve').patch(Authenticate, approveUser)


module.exports = router;
