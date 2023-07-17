const User = require('../models/User/userDetailSchema');
const sendMail = require('../utils/emailService');
const Settings = require('../models/settings/setting');

const multer = require('multer');
const AWS = require('aws-sdk');
const sharp = require('sharp');
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


exports.getAllPendingApprovalKYC = async (req, res, next) => {
    const pendingKYCUsers = await User.find({KYCStatus:'Pending Approval'});
    res.status(200).json({status:'success', data: pendingKYCUsers, results: pendingKYCUsers.length})
}

exports.getApporvedKYC = async (req,res,next) => {
    const approvedKYCs = await User.find({KYCStatus:'Approved'})
    res.status(200).json({status:'success', data: approvedKYCs, results: approvedKYCs.length})
}

exports.getRejectedKYCS = async (req,res,next) => {
    const rejectedKYCS = await User.find({KYCStatus:'Rejected'})
    res.status(200).json({status:'success', data: rejectedKYCS, results: rejectedKYCS.length})
}

exports.approveKYC = async(req,res,next) => {
    const userId = req.params.id;
    try{
      const user = await User.findById(userId);
      user.KYCStatus = 'Approved';
      user.KYCActionDate = new Date();
      console.log('user',user?.dob);
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
    user.KYCActionDate = new Date()
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

    res.status(200).json({status:'success', message:'KYC Rejected'});

}
