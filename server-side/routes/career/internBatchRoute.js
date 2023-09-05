const express = require("express");
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');
const router = express.Router({mergeParams: true});
const {createBatch, getTodaysInternshipOrders, getAllInternshipOrders, getBatch, 
        getBatches,getInactiveBatches,getCompletedBatches, editBatch, approveUser, 
        deleteBatch, getActiveBatches, getBatchParticipants, removeParticipantFromBatch, 
        getCurrentBatch, getWorkshops, getCurrentWorkshop, collegewiseuser, batchAndCollegeWiseUser,
        collegewiseuserPerticularBatch, batchWiseActiveAndInactiveUser, getEligibleInternshipBatch, downloadCertificate} = require('../../controllers/career/internBatch');


router.route('/').post(Authenticate,restrictTo('Admin', 'Super Admin'), createBatch).get(Authenticate, getBatches);
router.route('/active').get(getActiveBatches);
router.route('/currentinternship').get(Authenticate, getCurrentBatch)
router.route('/eligibleforcertificate').get(Authenticate, getEligibleInternshipBatch);
router.route('/download/:id').get(Authenticate, downloadCertificate);
router.route('/currentworkshop').get(Authenticate, getCurrentWorkshop)
router.route('/workshops').get(Authenticate, getWorkshops)
router.route('/inactive').get(Authenticate, getInactiveBatches);
router.route('/completed').get(Authenticate, getCompletedBatches);
router.route('/allorders').get(Authenticate, getAllInternshipOrders);
router.route('/todaysorders').get(Authenticate, getTodaysInternshipOrders)
router.route('/collegewiseuser').get(Authenticate, collegewiseuser)
router.route('/collegewiseuser/:id').get(Authenticate, restrictTo('Admin', 'Super Admin'), collegewiseuserPerticularBatch);
router.route('/batchwiseuser/:id').get(Authenticate, restrictTo('Admin', 'Super Admin'), batchWiseActiveAndInactiveUser);

router.route('/batchparticipants/:id').get(Authenticate, restrictTo('Admin', 'Super Admin'), getBatchParticipants);
router.route('/batchandcollegewise/:id/:college').get(Authenticate, restrictTo('Admin', 'Super Admin'), batchAndCollegeWiseUser);
router.route('/remove/:batchId/:userId').patch(Authenticate, restrictTo('Admin', 'Super Admin'), removeParticipantFromBatch);
router.route('/:id').patch(Authenticate, restrictTo('Admin', 'Super Admin'), editBatch).delete(Authenticate, restrictTo('Admin', 'Super Admin'), deleteBatch).get(Authenticate, getBatch);
router.route('/:id/approve').patch(Authenticate, restrictTo('Admin', 'Super Admin'), approveUser);


module.exports = router;
