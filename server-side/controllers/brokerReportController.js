const BrokerReport = require('../models/BrokerReport/brokerReport');

const multer = require('multer');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
console.log("File upload started");
  if (file.mimetype.startsWith("image/")|| file.mimetype.startsWith("application/")) {
    cb(null, true);
} else {
    cb(new Error("Invalid file type"), false);
}
}
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
    // accessKeyId: "AKIASR77BQMICZATCLPV",
    // secretAccessKey: "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",
  
  });
  
const upload = multer({ storage, fileFilter }).single("document");
console.log("Upload:",upload)
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


exports.uploadMulter = upload;

exports.resizePhoto = (req, res, next) => {
    if (!req.file || req.file.mimetype == 'application/pdf' ) {
      // no file uploaded, skip to next middleware
      console.log('no resizing');
      next();
      return;
    }
    sharp(req.file.buffer).resize({width: 500, height: 500}).toBuffer()
    .then((resizedImageBuffer) => {
      req.file.buffer = resizedImageBuffer;
      console.log("Resized:",resizedImageBuffer)
      next();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Error resizing photo" });
    });
}; 

exports.uploadToS3 = async(req, res, next) => {
    if (!req.file) {
      // no file uploaded, skip to next middleware
      next();
      return;
    }
  
    // create S3 upload parameters
    let fromDate;
    let toDate;
    let name;
    if(req.body.fromDate && req.body.toDate){
        fromDate = req.body.toDate;
        toDate = req.body.toDate;
        name = fromDate.toString().substr(0,10)+toDate.toString().substr(0,10);
    }else{
        let report = await BrokerReport.findById(req.params.id);
        fromDate = `${report?.fromDate}` ;
        toDate = `${report?.toDate}` ;
        name = fromDate.toString().substr(0,10)+toDate.toString().substr(0,10)
    }
    const key = `brokerreport/docs/cummulativereports/${name}/${(Date.now()) + req.file.originalname}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read',
    };
  
    // upload image to S3 bucket
    
    s3.upload((params)).promise()
      .then((s3Data) => {
        console.log('file uploaded');
        console.log(s3Data.Location);
        (req).uploadUrl = s3Data.Location;
        next();
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Error uploading to S3" });
      });
  };


  const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (
        allowedFields.includes(el) &&
        obj[el] !== null &&
        obj[el] !== undefined &&
        obj[el] !== ''
      ) {
        newObj[el] = obj[el];
      }
    });
    return newObj;
  };
  

exports.createBrokerReport =async (req, res, next) => {
    console.log(req.body)
    const{printDate, brokerName, clientCode, fromDate, toDate, cummulativeNSETurnover, 
        cummulativeBSETurnover, cummulativeNSEFuturesTurnover, cummulativeOptionsTurnover, 
        cummulativeTotalPurchaseTurnover, cummulativeTotalSaleTurnover, cummulativeTransactionCharge, 
        cummulativeGrossPNL, cummulativeNetPNL, cummulativeInterestCharge, cummulativeLotCharge, cummulativeIDCharge,
        } = req.body;
    const document = (req).uploadUrl;

    console.log(req.body);
    //Check for required fields 
    if(!(brokerName || clientCode || printDate || fromDate || toDate))return res.status(400).json({status: 'error', message: 'Enter all mandatory fields.'})
    try{
      //Check if user exists
      // if(await carousel.findOne({isDeleted: false, email})) return res.json({})('User with this email already exists. Please login with existing email.', 401));
      const brokerReport = await BrokerReport.create({printDate, brokerName, clientCode, fromDate, toDate, cummulativeNSETurnover,
         cummulativeBSETurnover, cummulativeNSEFuturesTurnover, cummulativeOptionsTurnover, cummulativeTotalPurchaseTurnover, 
         cummulativeTotalSaleTurnover, cummulativeTransactionCharge, cummulativeGrossPNL, cummulativeNetPNL, cummulativeInterestCharge,
          cummulativeLotCharge, cummulativeIDCharge, document, createdBy:req.user._id, lastModifiedBy:req.user._id});
  
      if(!brokerReport) return res.status(400).json({status: 'error', message: 'Couldn\'t create broker report'});
  
      res.status(201).json({status: "success", data:brokerReport, message: "Broker report created successfully"});
    }catch(e){
      console.log(e);
      res.status(500).json({status:'error', message: 'Something went wrong.'});
    }
    
};

exports.getBrokerReports = async (req, res, next)=>{
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const count = await BrokerReport.countDocuments()
  try{
    const brokerReports = await BrokerReport.find().sort({printDate:-1}).skip(skip).limit(limit);
  
      if(!brokerReports) return res.status(404).json({status:'error', message:'No reports found.'});
      
      res.status(200).json({status:"success", data: brokerReports, results: brokerReports.length , count: count});
  }catch(e){
      console.log(e);
      res.status(500).json({status:'error', message: 'Something went wrong.'});
  }  

};


exports.getBrokerReport = async (req, res, next) => {
    const id = req.params.id;

    try{
      const brokerReport = await BrokerReport.findOne({_id: id})
  
      if(!brokerReport) return res.status(404).json({status: 'error', message: 'No such report found.'});
      
      res.status(200).json({status:"success", data: brokerReport});
    }catch(e){
      console.log(e);
      res.status(500).json({status:'error', message: 'Something went wrong.'});
    }

};


exports.editBrokerReport = async (req, res, next) => {
    console.log("Report Values:",req.body)
    const id = req.params.id;
    try{

      const brokerReport = await BrokerReport.findOne({_id: id});
  
      if(!brokerReport) return res.status(404).json({status: 'error', message: 'No such report found.'});
  
      const filteredBody = filterObj(req.body, "printDate", "brokerName", "clientCode", "fromDate", 
      "toDate", "cummulativeNSETurnover", "cummulativeBSETurnover", "cummulativeNSEFuturesTurnover", 
      "cummulativeOptionsTurnover", "cummulativeTotalPurchaseTurnover", "cummulativeTotalSaleTurnover", 
      "cummulativeTransactionCharge", "cummulativeGrossPNL", "cummulativeNetPNL", "cummulativeTransactionCharge", 
      "cummulativeInterestCharge", "cummulativeLotCharge", "cummulativeIDCharge", 
      "lastModifiedOn");
      
      filteredBody.lastModifiedBy = req.user.id;
      filteredBody.lastModifiedOn = new Date();
      // console.log((req).uploadUrl);
      if ((req).file) filteredBody.document = (req).uploadUrl;
  
      
      const updatedBrokerReport = await BrokerReport.findByIdAndUpdate(id, filteredBody, {
          new: true
        }).select('-__v');
      res.status(200).json({status: "success", data:updatedBrokerReport, message:"Broker report updated"});
    }catch(e){
      console.log(e);
      res.status(500).json({status:'error', message: 'Something went wrong.'});
    }

};
