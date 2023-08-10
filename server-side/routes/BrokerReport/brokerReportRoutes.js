const express = require('express');
const{getBrokerReports, getBrokerReport, createBrokerReport, editBrokerReport, 
    uploadMulter, uploadToS3, resizePhoto, getSingularReportByBrokerAndDate} = require('../../controllers/brokerReportController');

const router = express.Router();
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');


const currentUser = (req,res,next) =>{
    req.params.id = (req).user._id;
    next(); 
}
router.route('/').get( Authenticate, restrictTo('Admin', 'SuperAdmin'), getBrokerReports).post( Authenticate, restrictTo('Admin', 'SuperAdmin'), uploadMulter, resizePhoto, uploadToS3, createBrokerReport);
router.route('/singular/:broker/:date').get( Authenticate, restrictTo('Admin', 'SuperAdmin'), getSingularReportByBrokerAndDate);
router.route('/:id').get( Authenticate, restrictTo('Admin', 'SuperAdmin'), getBrokerReport).patch(Authenticate,uploadMulter, resizePhoto, 
uploadToS3,editBrokerReport);



module.exports=router;