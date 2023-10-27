const express = require("express");
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');
const router = express.Router({mergeParams: true});
const {createCollege, getCentralZoneColleges, getNorthZoneColleges,
     getSouthZoneColleges, getEastZoneColleges, getWestZoneColleges,
     getColleges, editCollege, deleteCollege, getCollege, getCollegeName} = require('../../controllers/career/college');


router.route('/').post(Authenticate, restrictTo('Admin', 'Super Admin'),createCollege).get(Authenticate, restrictTo('Admin', 'Super Admin'), getColleges);
router.route('/central').get(Authenticate, restrictTo('Admin', 'Super Admin'), getCentralZoneColleges);
router.route('/north').get(Authenticate, restrictTo('Admin', 'Super Admin'), getNorthZoneColleges);
router.route('/south').get(Authenticate, restrictTo('Admin', 'Super Admin'), getSouthZoneColleges);
router.route('/east').get(Authenticate, restrictTo('Admin', 'Super Admin'), getEastZoneColleges);
router.route('/west').get(Authenticate, restrictTo('Admin', 'Super Admin'), getWestZoneColleges);
router.route('/collegeName').get(Authenticate, restrictTo('Admin', 'Super Admin'), getCollegeName);
router.route('/collegeList').get(getCollegeName);

router.route('/:id').patch(Authenticate, restrictTo('Admin', 'Super Admin'), editCollege).get(Authenticate, restrictTo('Admin', 'Super Admin'), getCollege);
router.route('/delete/:id').patch(Authenticate, restrictTo('Admin', 'Super Admin'), deleteCollege);

// router.route('/:id/approve').patch(Authenticate, approveUser)


module.exports = router;
