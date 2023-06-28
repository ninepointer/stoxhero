const express = require('express');
const Authenticate = require('../../authentication/authentication');
const{getBrokerReports, getBrokerReport, createBrokerReport, editBrokerReport, 
    uploadMulter, uploadToS3, resizePhoto, getSingularReportByBrokerAndDate} = require('../../controllers/brokerReportController');

const router = express.Router();

const currentUser = (req,res,next) =>{
    req.params.id = (req).user._id;
    next(); 
}
router.route('/').get(getBrokerReports).post(Authenticate, uploadMulter, resizePhoto, uploadToS3, createBrokerReport);
router.route('/singular/:broker/:date').get(Authenticate, getSingularReportByBrokerAndDate);
router.route('/:id').get(Authenticate, getBrokerReport).patch(Authenticate,uploadMulter, resizePhoto, 
uploadToS3,editBrokerReport);



module.exports=router;