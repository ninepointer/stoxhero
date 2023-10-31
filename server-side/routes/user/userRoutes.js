const express = require("express");
const router = express.Router({mergeParams: true});
const {getUsers, changePassword, editUser, deactivateUser, getdeactivateUser, getFilteredUsers, understoodGst, checkUserExist} = require('../../controllers/userController');

const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');

const setCurrentUser = async(req,res,next) => {
    req.params.id = req.user._id;
    next();
} 


router.route('/').patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), editUser);
router.route('/deactivate').post(Authenticate, restrictTo('Admin', 'SuperAdmin'), deactivateUser).get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getdeactivateUser)
router.route('/searchuser').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getUsers);
router.route('/filteredusers').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getFilteredUsers);
router.route('/understood').post(Authenticate, understoodGst);
router.route('/changepassword/me').patch(Authenticate, setCurrentUser, changePassword);
router.route('/changepassword/:id').patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), changePassword);
router.route('/exist/:mobile').get(checkUserExist);


module.exports = router;