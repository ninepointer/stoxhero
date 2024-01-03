const User = require('../models/User/userDetailSchema');
const sendMail = require('../utils/emailService');
const {generateAadhaarOtp, verifyAadhaarOtp, verifyPan, verifyBankAccount} = require('../utils/kycService');
const {sendMultiNotifications} = require('../utils/fcmService');
const Settings = require('../models/settings/setting');

const multer = require('multer');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const {createUserNotification} = require('../controllers/notification/notificationController');

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
console.log("File upload started");
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("application/")) {
    cb(null, true);
} else {
    cb(new Error("Invalid file type"), false);
}
}
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  
  });
  
const upload = multer({ storage, fileFilter }).single("transactionDocument");
console.log("Upload:",upload)
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


exports.uploadMulter = upload;

exports.resizePhoto = (req, res, next) => {
    if (!req.file) {
      // no file uploaded, skip to next middleware
      console.log('no file');
      next();
      return;
    }
    sharp(req.file.buffer).resize({width: 500, height: 500}).toBuffer()
    .then((resizedImageBuffer) => {
      req.file.buffer = resizedImageBuffer;
    //   console.log("Resized:",resizedImageBuffer)
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
    const key = `withdrawals/documents/${(Date.now()) + req.file.originalname}`;
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
        // console.log('file uploaded');
        // console.log(s3Data.Location);
        (req).uploadUrl = s3Data.Location;
        next();
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Error uploading to S3" });
      });
  };


exports.getAllPendingApprovalKYC = async (req, res, next) => {
    const pendingKYCUsers = await User.find({KYCStatus:'Pending Approval'})
    .sort({KYCActionDate: -1})
    res.status(200).json({status:'success', data: pendingKYCUsers, results: pendingKYCUsers.length})
}

exports.getApporvedKYC = async (req,res,next) => {
    const approvedKYCs = await User.find({KYCStatus:'Approved'})
    .sort({KYCActionDate: -1})
    res.status(200).json({status:'success', data: approvedKYCs, results: approvedKYCs.length})
}

exports.getRejectedKYCS = async (req,res,next) => {
    const rejectedKYCS = await User.find({KYCStatus:'Rejected'})
    .sort({KYCActionDate: -1})
    res.status(200).json({status:'success', data: rejectedKYCS, results: rejectedKYCS.length})
}

exports.approveKYC = async(req,res,next) => {
    const userId = req.params.id;
    try{
      const user = await User.findById(userId);
      user.KYCStatus = 'Approved';
      user.KYCActionDate = new Date();
      user.lastModified = new Date();
    //   console.log('user',user?.dob);
      await user.save({validateBeforeSave:false});
      if(process.env.PROD == 'true'){
        sendMail(user.email, 'KYC Approved - StoxHero', `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>KYC Approved</title>
            <style>
            body {
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.5;
                margin: 0;
                padding: 0;
            }
  
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ccc;
            }
  
            h1 {
                font-size: 24px;
                margin-bottom: 20px;
            }
  
            p {
                margin: 0 0 20px;
            }
  
            .userid {
                display: inline-block;
                background-color: #f5f5f5;
                padding: 10px;
                font-size: 15px;
                font-weight: bold;
                border-radius: 5px;
                margin-right: 10px;
            }
  
            .password {
                display: inline-block;
                background-color: #f5f5f5;
                padding: 10px;
                font-size: 15px;
                font-weight: bold;
                border-radius: 5px;
                margin-right: 10px;
            }
  
            .login-button {
                display: inline-block;
                background-color: #007bff;
                color: #fff;
                padding: 10px 20px;
                font-size: 18px;
                font-weight: bold;
                text-decoration: none;
                border-radius: 5px;
            }
  
            .login-button:hover {
                background-color: #0069d9;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <h1>KYC Approved</h1>
            <p>Hello ${user.first_name},</p>
            <p>Your KYC Approval request is approved by stoxhero.</p>
            <p>You can now add or withdraw money from your wallet and get more in app privileges.</p>
            <p>You can check your profile to see your KYC status.</p>
            <p>In case of any discrepencies, raise a ticket or reply to this message.</p>
            <a href="https://stoxhero.com/contact" class="login-button">Write to Us Here</a>
            <br/><br/>
            <p>Thanks,</p>
            <p>StoxHero Team</p>
  
            </div>
        </body>
        </html>
        `);
      }
      await createUserNotification({
        title:'KYC Approved',
        description:'KYC Request approved by Admin',
        notificationType:'Individual',
        notificationCategory:'Informational',
        productCategory:'General',
        user: user?._id,
        priotity:'High',
        channels:['App', 'Email'],
        createdBy:'63ecbc570302e7cf0153370c',
        lastModifiedBy:'63ecbc570302e7cf0153370c'  
      });
      if(user?.fcmTokens?.length>0){
        await sendMultiNotifications('KYC Approved', 
          `Your KYC Request was approved. You are now eligible for withdrawals.`,
          user?.fcmTokens?.map(item=>item.token)
          )  
      }
  
      res.status(200).json({status:'success', message:'KYC Approved'});
    }catch(e){
      console.log(e);
    }

}

exports.rejectKYC = async(req,res,next) => {
    const userId = req.params.id;
    const {rejectionReason} = req.body;
    const user = await User.findById(userId);
    user.KYCStatus = 'Rejected';
    user.KYCRejectionReason = rejectionReason;
    user.KYCActionDate = new Date();
    user.lastModified = new Date();
    await user.save({validateBeforeSave:false});
    if(process.env.PROD == 'true'){
      sendMail(user.email, 'KYC Rejected - StoxHero', `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>KYC Rejected</title>
          <style>
          body {
              font-family: Arial, sans-serif;
              font-size: 16px;
              line-height: 1.5;
              margin: 0;
              padding: 0;
          }
  
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ccc;
          }
  
          h1 {
              font-size: 24px;
              margin-bottom: 20px;
          }
  
          p {
              margin: 0 0 20px;
          }
  
          .userid {
              display: inline-block;
              background-color: #f5f5f5;
              padding: 10px;
              font-size: 15px;
              font-weight: bold;
              border-radius: 5px;
              margin-right: 10px;
          }
  
          .password {
              display: inline-block;
              background-color: #f5f5f5;
              padding: 10px;
              font-size: 15px;
              font-weight: bold;
              border-radius: 5px;
              margin-right: 10px;
          }
  
          .login-button {
              display: inline-block;
              background-color: #007bff;
              color: #fff;
              padding: 10px 20px;
              font-size: 18px;
              font-weight: bold;
              text-decoration: none;
              border-radius: 5px;
          }
  
          .login-button:hover {
              background-color: #0069d9;
          }
          </style>
      </head>
      <body>
          <div class="container">
          <h1>KYC Rejected</h1>
          <p>Hello ${user.first_name},</p>
          <p>Your KYC approval request is rejected by stoxhero. The rejection reason is ${rejectionReason}</p>
          <p>Please double check your documents and inputs and make sure you've uploaded the correct doucments in the right formats.</p>
          <p>If you're sure there is an error on our part, contact the admin or POC.</p>
          <p>Or in case of discrepencies, raise a ticket or reply to this message.</p>
          <a href="https://stoxhero.com/contact" class="login-button">Write to Us Here</a>
          <br/><br/>
          <p>Thanks,</p>
          <p>StoxHero Team</p>
  
          </div>
      </body>
      </html>
      `)
    }
    await createUserNotification({
      title:'KYC Rejected',
      description:`KYC Request rejected by Admin. Reason-${rejectionReason}`,
      notificationType:'Individual',
      notificationCategory:'Informational',
      productCategory:'General',
      user: user?._id,
      priotity:'High',
      channels:['App', 'Email'],
      createdBy:'63ecbc570302e7cf0153370c',
      lastModifiedBy:'63ecbc570302e7cf0153370c'  
    });
    if(user?.fcmTokens?.length>0){
      await sendMultiNotifications('KYC Rejected', 
        `Reason-${rejectionReason}`,
        user?.fcmTokens?.map(item=>item.token)
        )  
    }


    res.status(200).json({status:'success', message:'KYC Rejected'});

}

exports.generateOtp = async(req,res) => {
  const {aadhaarNumber} = req.body;
  console.log('aadhaar otp req');
  try{
    const client_id = await generateAadhaarOtp(aadhaarNumber);
    res.status(200).json({status:'success', data:client_id});  
  }catch(e){
    console.log(e);
    const statusCode = e?.statusCode || 500;
    // res.status(500).json({status:'error', message:'Something went wrong', error:e.message});
    res.status(statusCode).json({ status: 'error', message: e?.message });
  }
}

exports.verifyOtp = async(req,res) =>{
  const{client_id, otp, panNumber, bankAccountNumber, ifsc} = req.body;
  console.log(req.body);
  try{
    const aadhaarData =  await verifyAadhaarOtp(client_id, otp);
    console.log('aadhaar data', aadhaarData);
    const panData = await verifyPan(panNumber);
    console.log('pan data', panData);
    const bankAccountData = await verifyBankAccount(bankAccountNumber, ifsc);
    console.log('bank account data', bankAccountData);
    const user = await User.findById(req?.user?._id);
    if (
      aadhaarData?.full_name?.trim()?.toLowerCase() === panData?.full_name?.trim()?.toLowerCase() &&
      panData?.full_name?.trim()?.toLowerCase() === bankAccountData?.full_name?.trim()?.toLowerCase()
    ){
      user.KYCStatus = 'Approved';
      user.KYCActionDate = new Date();
      user.full_name = aadhaarData?.full_name;
      user.aadhaarNumber = aadhaarData?.aadhaar_number;
      user.panNumber = panData?.pan_number;
      user.accountNumber =bankAccountNumber;
      user.ifscCode = ifsc;
      await user.save({validateBeforeSave:false});
      res.status(200).json({status:'success', message:'KYC Approved'});
    }else{
      user.KYCStatus = 'Rejected';
      user.KYCRejectionReason = 'Aadhaar PAN and Bank Account Names don\'t match'
      await user.save({validateBeforeSave:false});
      res.status(400).json({status:'error', message:'KYC Rejected as Aadhaar PAN and Bank Account Names don\'t match'});
    }
  }catch(e){
    console.log(e);
    const statusCode = e?.statusCode || 500;
    // res.status(500).json({status:'error', message:'Something went wrong', error:e.message});
    res.status(statusCode).json({ status: 'error', message: e?.message });
  }
}
