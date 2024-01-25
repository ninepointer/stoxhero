const express = require("express");
const otpGenerator = require('otp-generator')
const emailService = require("../../utils/emailService")
const router = express.Router();
require("../../db/conn");
const UserDetail = require("../../models/User/userDetailSchema");
const authController = require("../../controllers/authController");
const multer = require('multer');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const Authenticate = require("../../authentication/authentication");
const Wallet = require('../../models/UserWallet/userWalletSchema');
const { ObjectId } = require("mongodb");
const Role = require("../../models/User/everyoneRoleSchema");
const sendMail = require('../../utils/emailService');
const {sendMultiNotifications} = require('../../utils/fcmService');
const restrictTo = require('../../authentication/authorization');
const {createUserNotification} = require('../../controllers/notification/notificationController');


const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
if (file.mimetype.startsWith("image/")) {
    cb(null, true);
} else {
    cb(new Error("Invalid file type"), false);
  }
}

const upload = multer({ storage, fileFilter 
  // limits: {
  // fileSize: 1024 * 1024 * 10,
  // files: 1} 
  }).single("profilePhoto");
const uploadMultiple = multer({ storage, fileFilter,
  limits: {
    fieldSize: 1024 * 1024 * 10, // 10MB maximum file size
  }
}).fields([{ name: 'profilePhoto', maxCount: 1 }, 
{ name: 'aadhaarCardFrontImage', maxCount: 1 }, { name: 'aadhaarCardBackImage', maxCount: 1 }, 
{ name: 'panCardFrontImage', maxCount: 1 }, { name: 'passportPhoto', maxCount: 1 },
{ name: 'addressProofDocument', maxCount: 1 }, { name: 'incomeProofDocument', maxCount: 1 } ]);
// const uploadMultiple = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     console.log('file filter', file, file.size);
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//   } else {
//       req.invalidFile = true;
//       cb(new Error("Invalid file type"), false);
//     }
//     if (file.size > 2 * 1024 * 1024) {
//       console.log('fileSize', file.size) // 2MB size check
//       cb(null, true);
//       req.tooLarge = true; // set a flag to indicate a file was too large
//     } else {
//       cb(null, false);
//     }
//   },
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB
//   },
// }).fields([
//   { name: 'profilePhoto', maxCount: 1 },
//   { name: 'aadhaarCardFrontImage', maxCount: 1 },
//   { name: 'aadhaarCardBackImage', maxCount: 1 },
//   { name: 'panCardFrontImage', maxCount: 1 },
//   { name: 'passportPhoto', maxCount: 1 },
//   { name: 'addressProofDocument', maxCount: 1 },
//   { name: 'incomeProofDocument', maxCount: 1 }
// ]);

const checkFileError = async (req,res,next) =>{
  const files = req.files;
  for (let key in files) {
    console.log('file size', files[key][0].size);
    if (files[key][0].size > 2 * 1024 * 1024) { // 2MB size check
      return res.status(400).json({
        status: 'error',
        message: 'File size limit is 2MB. Upload a smaller file.'
      });
    }
  }
  next();
}
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const resizePhoto = async (req, res, next) => {
    // console.log('resize func');
    // console.log("Uploaded Files: ",req.files)
    if (!req.files) {
      // no file uploaded, skip to next middleware
      next();
      return;
    }
    
    const { profilePhoto, aadhaarCardFrontImage, aadhaarCardBackImage, panCardFrontImage, 
        passportPhoto, addressProofDocument, incomeProofDocument } = (req.files);

    if (profilePhoto && profilePhoto[0].buffer) {
        const resizedProfilePhoto = await sharp(profilePhoto[0].buffer)
          .resize({ width: 500, height: 500 })
          .toBuffer();
        (req.files).profilePhotoBuffer = resizedProfilePhoto;
      }
    
      if (aadhaarCardFrontImage && aadhaarCardFrontImage[0].buffer) {
        const resizedAadhaarCardFrontImage = await sharp(aadhaarCardFrontImage[0].buffer)
          // .resize({ width: 1024, height: 720 })
          .toBuffer();
          (req.files).aadhaarCardFrontImageBuffer = resizedAadhaarCardFrontImage;
      }
      if (aadhaarCardBackImage && aadhaarCardBackImage[0].buffer) {
        const resizedAadhaarCardBackImage = await sharp(aadhaarCardBackImage[0].buffer)
          // .resize({ width: 1024, height: 720 })
          .toBuffer();
          (req.files).aadhaarCardBackImageBuffer = resizedAadhaarCardBackImage;
      }

      if (panCardFrontImage && panCardFrontImage[0].buffer) {
        const resizedPanCardFrontImage = await sharp(panCardFrontImage[0].buffer)
          // .resize({ width: 1024, height: 720 })
          .toBuffer();
          (req.files).panCardFrontImageBuffer = resizedPanCardFrontImage;
      }
      if (passportPhoto && passportPhoto[0].buffer) {
        const resizedPassportPhoto = await sharp(passportPhoto[0].buffer)
          .resize({ width: 1024, height: 720 })
          .toBuffer();
          (req.files).passportPhotoBuffer = resizedPassportPhoto;
      }
      if (addressProofDocument && addressProofDocument[0].buffer) {
        const resizedAddressProofDocument = await sharp(addressProofDocument[0].buffer)
          // .resize({ width: 1024, height: 720 })
          .toBuffer();
          (req.files).addressProofDocumentBuffer = resizedAddressProofDocument;
      }
      if (incomeProofDocument && incomeProofDocument[0].buffer) {
        const resizedIncomeProofDocument = await sharp(incomeProofDocument[0].buffer)
          // .resize({ width: 1000, height: 500 })
          .toBuffer();
          (req.files).incomeProofDocumentBuffer = resizedIncomeProofDocument;
      }
      next();
}; 

const uploadToS3 = async (req, res, next) => {
    if (!req.files) {
      // no file uploaded, skip to next middleware
      next();
      return;
    }
  
    try {
      if ((req.files).profilePhoto) {
        let userName;
        const user = await UserDetail.findById(req.params.id);
        userName = `${user?.first_name}`+`${user?.last_name}` + `${user?._id}` ;
        const key = `users/${userName}/photos/display/${Date.now() + (req.files).profilePhoto[0].originalname}`;
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          region: process.env.AWS_REGION,
          Body: (req.files).profilePhotoBuffer,
          ContentType: (req.files).profilePhoto.mimetype,
          ACL: 'public-read',
        };
  
        // upload image to S3 bucket
        const s3Data = await s3.upload(params).promise();
        (req).profilePhotoUrl = s3Data.Location;
      }
  
      if ((req.files).aadhaarCardFrontImage) {
        let userName;
        const user = await UserDetail.findById(req.params.id);
        if(user.KYCStatus == 'Approved'){
          return res.status(400).json({status:'error', message:'KYC is completed. Can\'t change documents after approval.'})
        }
        userName = `${user?.first_name}`+`${user?.last_name}`+ `${user?.name}`+`${user?._id}` ;
        const key = `users/${userName}/photos/aadharFront/${Date.now() + (req.files).aadhaarCardFrontImage[0].originalname}`;
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          region: process.env.AWS_REGION,
          Body: (req.files).aadhaarCardFrontImageBuffer,
          ContentType: (req.files).aadhaarCardFrontImage.mimetype,
          ACL: 'public-read',
        };
  
        // upload image to S3 bucket
        const s3Data = await s3.upload(params).promise();
        (req).aadhaarCardFrontImageUrl = s3Data.Location;
      }

      if ((req.files).aadhaarCardBackImage) {
        let userName;
        const user = await UserDetail.findById(req.params.id);
        if(user.KYCStatus == 'Approved'){
          return res.status(400).json({status:'error', message:'KYC is completed. Can\'t change documents after approval.'})
        }
        userName = `${user?.first_name}`+`${user?.last_name}`+ `${user?.name}`+`${user?._id}` ;
        const key = `users/${userName}/photos/aadharBack/${Date.now() + (req.files).aadhaarCardBackImage[0].originalname}`;
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          region: process.env.AWS_REGION,
          Body: (req.files).aadhaarCardBackImageBuffer,
          ContentType: (req.files).aadhaarCardBackImage.mimetype,
          ACL: 'public-read',
        };
  
        // upload image to S3 bucket
        const s3Data = await s3.upload(params).promise();
        (req).aadhaarCardBackImageUrl = s3Data.Location;
      }
      if ((req.files).panCardFrontImage) {
        let userName;
        const user = await UserDetail.findById(req.params.id);
        if(user.KYCStatus == 'Approved'){
          return res.status(400).json({status:'error', message:'KYC is completed. Can\'t change documents after approval.'})
        }
        userName = `${user?.first_name}`+`${user?.last_name}`+ `${user?.name}`+`${user?._id}` ;
        const key = `users/${userName}/photos/panFront/${Date.now() + (req.files).panCardFrontImage[0].originalname}`;
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          region: process.env.AWS_REGION,
          Body: (req.files).panCardFrontImageBuffer,
          ContentType: (req.files).panCardFrontImage.mimetype,
          ACL: 'public-read',
        };
  
        // upload image to S3 bucket
        const s3Data = await s3.upload(params).promise();
        (req).panCardFrontImageUrl = s3Data.Location;
      }
      if ((req.files).passportPhoto) {
        let userName;
        const user = await UserDetail.findById(req.params.id);
        userName = `${user?.first_name}`+`${user?.last_name}`+ `${user?.name}`+`${user?._id}` ;
        const key = `users/${userName}/photos/passport/${Date.now() + (req.files).passportPhoto[0].originalname}`;
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          region: process.env.AWS_REGION,
          Body: (req.files).passportPhotoBuffer,
          ContentType: (req.files).passportPhoto.mimetype,
          ACL: 'public-read',
        };
  
        // upload image to S3 bucket
        const s3Data = await s3.upload(params).promise();
        (req).passportPhotoUrl = s3Data.Location;
      }
      if ((req.files).addressProofDocument) {
        let userName;
        const user = await UserDetail.findById(req.params.id);
        userName = `${user?.first_name}`+`${user?.last_name}`+ `${user?.name}`+`${user?._id}` ;
        const key = `users/${userName}/photos/addressProof/${Date.now() + (req.files).addressProofDocument[0].originalname}`;
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          region: process.env.AWS_REGION,
          Body: (req.files).addressProofDocumentBuffer,
          ContentType: (req.files).addressProofDocument.mimetype,
          ACL: 'public-read',
        };
  
        // upload image to S3 bucket
        const s3Data = await s3.upload(params).promise();
        (req).addressProofDocumentUrl = s3Data.Location;
      }
      if ((req.files).incomeProofDocument) {
        let userName;
        const user = await UserDetail.findById(req.params.id);
        userName = `${user?.first_name}`+`${user?.last_name}`+ `${user?.name}`+`${user?._id}` ;
        const key = `users/${userName}/photos/incomeProof/${Date.now() + (req.files).incomeProofDocument[0].originalname}`;
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          region: process.env.AWS_REGION,
          Body: (req.files).incomeProofDocumentBuffer,
          ContentType: (req.files).incomeProofDocument.mimetype,
          ACL: 'public-read',
        };
  
        // upload image to S3 bucket
        const s3Data = await s3.upload(params).promise();
        (req).incomeProofDocumentUrl = s3Data.Location;
      }
  
      next();
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Error uploading to S3' });
    }
  };


router.post("/userdetail", authController.protect, (req, res)=>{
    const {status, uId, createdOn, lastModified, createdBy, name, cohort, designation, email, mobile, degree, dob, gender, trading_exp, location, last_occupation, joining_date, role, userId, password, employeeId} = req.body;
    if(!status || !uId || !createdOn || !lastModified || !createdBy || !name || !cohort || !designation || !email || !mobile || !degree || !dob || !gender || !trading_exp || !location || !last_occupation || !joining_date || !role){
        return res.status(422).json({error : "plz filled the field..."})
    }

    UserDetail.findOne({email : email})
    .then((dateExist)=>{
        if(dateExist){
            return res.status(422).json({error : "data already exist..."})
        }
        const userDetail = new UserDetail({status, uId, createdOn, lastModified, createdBy, name, cohort, designation, email, mobile, degree, dob, gender, trading_exp, location, last_occupation, joining_date, role, userId, password, employeeid: employeeId});
        userDetail.save().then(()=>{
            res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
    }).catch(err => {console.log("failed in userAuth")});
})

router.patch("/resetpassword", async (req, res)=>{
    const {email, resetPasswordOTP, confirm_password, password} = req.body;
    
    const deactivatedUser = await UserDetail.findOne({ email: email, status: "Inactive" })

    if(deactivatedUser){
        return res.status(422).json({ status: 'error', message: "Your account has been deactivated. Please contact StoxHero admin @ team@stoxhero.com.", error: "deactivated" });
    }
    let resetuser = await UserDetail.findOne({email : email})
    if(!resetuser)
    {
        return res.status(404).json({error : "User doesn't exist"})
    }

    if(resetPasswordOTP != resetuser.resetPasswordOTP)
    {
        return res.status(401).json({message : "OTP doesn't match, please try again!"})
    }

    if(password != confirm_password)
    {
        return res.status(401).json({message : "Password & Confirm Password didn't match."})
    }
        
        resetuser.password = password
        await resetuser.save({validateBeforeSave:false})
        return res.status(200).json({message : "Password Reset Done"})
})

router.patch("/generateOTP", async (req, res)=>{
    const {email} = req.body

    const deactivatedUser = await UserDetail.findOne({ email: email, status: "Inactive" })

    if(deactivatedUser){
        return res.status(422).json({ status: 'error', message: "Your account has been deactivated. Please contact StoxHero admin @ team@stoxhero.com.", error: "deactivated" });
    }
    
    const resetuser = await UserDetail.findOne({email: email})
    if(!resetuser)
    {
        return res.status(404).json({
            message: "User with this email doesn't exist"
        })
    }
    let email_otp = otpGenerator.generate(6, { upperCaseAlphabets: true,lowerCaseAlphabets: false, specialChars: false });
    let subject = "Password Reset StoxHero";
    let message = `Your OTP for password reset is: ${email_otp}`
    resetuser.resetPasswordOTP = email_otp
        await resetuser.save({validateBeforeSave:false});
        res.status(200).json({
            message: "Password Reset OTP Resent"
        })
    emailService(email,subject,message);
})

router.get("/readuserdetails", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res) => {
  UserDetail.find()
    .populate("role","roleName") // Populate the "role" field
    .sort({ joining_date: -1 })
    .exec((err, data) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        return res.status(200).send(data);
      }
    });
});

router.get("/readuserdetails/:id", Authenticate, (req, res)=>{

    const {id} = req.params
    UserDetail.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.put("/readuserdetails/:id", Authenticate, async (req, res)=>{

    try{
        const {id} = req.params

        const user = await UserDetail.findOne({_id: id})
        
        if(req.body.userPassword){
            user.lastModified = req.body.lastModified,
            user.name = req.body.Name,
            user.cohort = req.body.Cohort,
            user.designation = req.body.Designation,
            user.degree = req.body.Degree,
            user.email = req.body.EmailID,
            user.mobile = req.body.MobileNo,
            user.dob = req.body.DOB,
            user.gender = req.body.Gender,
            user.trading_exp = req.body.TradingExp,
            user.location = req.body.Location,
            user.last_occupation = req.body.LastOccupation,
            user.joining_date = req.body.DateofJoining,
            user.role = req.body.Role,
            user.status = req.body.Status,
            user.password = req.body.userPassword,
            user.employeeid = req.body.employeeId,
            user.isAlgoTrader = req.body.isalgoTrader
        } else{
            user.lastModified = req.body.lastModified,
            user.name = req.body.Name,
            user.cohort = req.body.Cohort,
            user.designation = req.body.Designation,
            user.degree = req.body.Degree,
            user.email = req.body.EmailID,
            user.mobile = req.body.MobileNo,
            user.dob = req.body.DOB,
            user.gender = req.body.Gender,
            user.trading_exp = req.body.TradingExp,
            user.location = req.body.Location,
            user.last_occupation = req.body.LastOccupation,
            user.joining_date = req.body.DateofJoining,
            user.role = req.body.Role,
            user.status = req.body.Status,
            user.employeeid = req.body.employeeId,
            user.isAlgoTrader = req.body.isalgoTrader
        }

        await user.save();
        res.status(201).json({massage : "data edit succesfully"});

    } catch (e){
        console.log(e)
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.delete("/readuserdetails/:id", Authenticate, async (req, res)=>{
 
    try{
        const {id} = req.params
        const userDetail = await UserDetail.deleteOne({_id : id})
        res.status(201).json({massage : "data delete succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }

})

router.get("/readparticularuserdetails/:email", Authenticate, (req, res)=>{
    const {email} = req.params
    UserDetail.findOne({email : email})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

// admin id --> new ObjectId("6448f834446977851c23b3f5")
router.get("/getAdmins/", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{
    UserDetail.find({role : new ObjectId("6448f834446977851c23b3f5") })
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/getallbatch", Authenticate, restrictTo('Admin', 'SuperAdmin'), async(req, res)=>{

    let batch = await UserDetail.aggregate([
        {
          $group:
            {
              _id: "$cohort",
            },
        },
        {
          $sort:
            {
              _id: -1,
            },
        },
      ])
            

        res.status(201).json(batch);

});

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el) && obj[el] !== null && obj[el] !== undefined && obj[el] !== '') {
        newObj[el] = obj[el];
      }
    });
    return newObj;
  };
  
const currentUser = (req,res, next) =>{
    req.params.id = req.user._id;
    next();
};

router.patch('/userdetail/me', authController.protect, currentUser, uploadMultiple, checkFileError, resizePhoto, uploadToS3, async(req,res,next)=>{

    try{
        const user = await UserDetail.findById(req.user._id);
    
        if(!user) return res.status(404).json({message: 'No such user found.'});
    
        const filteredBody = filterObj(req.body, 'name', 'first_name', 'last_name', 'email', 'mobile','gender', 
        'whatsApp_number', 'dob', 'address', 'city', 'state', 'country', 'last_occupation', 'family_yearly_income',
        'employeed', 'upiId','googlePay_number','payTM_number','phonePe_number','bankName','nameAsPerBankAccount','accountNumber',
        'ifscCode', 'bankState','aadhaarNumber','degree','panNumber','passportNumber','drivingLicenseNumber','pincode', 'KYCStatus'
        );
        if(filteredBody.KYCStatus == 'Approved') {
          filteredBody.KYCStatus = 'Rejected';
          filteredBody.rejectionReason = 'API Abuse'
          filteredBody.KYCActionDate = new Date();
        }
        if(filteredBody.KYCStatus == 'Pending Approval'){
          let aadhaarNumber, panNumber, dob;
          aadhaarNumber = filteredBody.aadhaarNumber;
          panNumber = filteredBody.panNumber;
          dob = filteredBody.dob;
          const users = await UserDetail.find({KYCStatus:'Approved', $or:[{aadhaarNumber:aadhaarNumber}, {panNumber:panNumber}, {dob:dob}]});
          if(users.length>1){
            filteredBody.KYCStatus = 'Rejected';
            filteredBody.rejectionReason = 'Aadhaar or PAN number is already in use.'
          }
          filteredBody.KYCActionDate = new Date();
        }
        if(filteredBody.KYCStatus == 'Pending Approval' && process.env.PROD == 'true'){
          await sendMail(user?.email, 'KYC Verification Request Received', `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>KYC Request Received</title>
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
                <h1>KYC Verification Request Received</h1>
                <p>Hello ${user.first_name},</p>
                <p>Your request for KYC verification is received by stoxhero team.</p>
                <p>We will be verifying your documents and information in the next 24-48 working hours. The final KYC Status will be intimated to you via mail and it will also be reflected in your profile section.</p>
                <p>In case of any discrepencies, raise a ticket or reply to this message.</p>
                <a href="https://stoxhero.com/contact" class="login-button">Write to Us Here</a>
                <br/><br/>
                <p>Thanks,</p>
                <p>StoxHero Team</p>
        
                </div>
            </body>
            </html>
        
        ` );
          await createUserNotification({
            title:'KYC Verification Request Received',
            description:`Your KYC Verification request is received. It might take 3-5 business days to get processed.`,
            notificationType:'Individual',
            notificationCategory:'Informational',
            productCategory:'General',
            user: user?._id,
            priority:'Low',
            channels:['App', 'Email'],
            createdBy:'63ecbc570302e7cf0153370c',
            lastModifiedBy:'63ecbc570302e7cf0153370c'  
          });
          if(user?.fcmTokens?.length>0){
            await sendMultiNotifications('KYC Verification Request Received', 
              `Ypur KYC Verification request is received. It may take 3-5 business days for the process to be completed.`,
              user?.fcmTokens?.map(item=>item.token), null, {route:'profile'}
              )  
          }
        }
        filteredBody.lastModified = new Date();
  
        // if((req).profilePhotoUrl) filteredBody.profilePhoto = (req).profilePhotoUrl;
        // if((req).aadhaarCardFrontImageUrl) filteredBody.aadhaarCardFrontImage = (req).aadhaarCardFrontImageUrl;
        // if((req).aadhaarCardBackImageUrl) filteredBody.aadhaarCardBackImage = (req).aadhaarCardBackImageUrl;
        // if((req).panCardFrontImageUrl) filteredBody.panCardFrontImage = (req).panCardFrontImageUrl;
        // if((req).passportPhotoUrl) filteredBody.passportPhoto = (req).passportPhotoUrl;
        
        if (req.profilePhotoUrl) {
          if (!filteredBody.profilePhoto) {
            filteredBody.profilePhoto = {};
          }
          filteredBody.profilePhoto.url = req.profilePhotoUrl;
          filteredBody.profilePhoto.name = (req.files).profilePhoto[0].originalname;
        }

        if (req.aadhaarCardFrontImageUrl) {
          if (!filteredBody.aadhaarCardFrontImage) {
            filteredBody.aadhaarCardFrontImage = {};
          }
          filteredBody.aadhaarCardFrontImage.url = req.aadhaarCardFrontImageUrl;
          filteredBody.aadhaarCardFrontImage.name = (req.files).aadhaarCardFrontImage[0].originalname;
        }

        if (req.aadhaarCardBackImageUrl) {
          if (!filteredBody.aadhaarCardBackImage) {
            filteredBody.aadhaarCardBackImage = {};
          }
          filteredBody.aadhaarCardBackImage.url = req.aadhaarCardBackImageUrl;
          filteredBody.aadhaarCardBackImage.name = (req.files).aadhaarCardBackImage[0].originalname;
        }

        if (req.panCardFrontImageUrl) {
          if (!filteredBody.panCardFrontImage) {
            filteredBody.panCardFrontImage = {};
          }
          filteredBody.panCardFrontImage.url = req.panCardFrontImageUrl;
          filteredBody.panCardFrontImage.name = (req.files).panCardFrontImage[0].originalname;
        }

        if (req.passportPhotoUrl) {
          if (!filteredBody.passportPhoto) {
            filteredBody.passportPhoto = {};
          }
          filteredBody.passportPhoto.url = req.passportPhotoUrl;
          filteredBody.passportPhoto.name = (req.files).passportPhoto[0].originalname;
        }

        if (req.addressProofDocumentUrl) {
          if (!filteredBody.addressProofDocument) {
            filteredBody.addressProofDocument = {};
          }
          filteredBody.addressProofDocument.url = req.addressProofDocumentUrl;
          filteredBody.addressProofDocument.name = (req.files).addressProofDocument[0].originalname;
        }
        // if((req).addressProofDocumentUrl) filteredBody.addressProofDocument.name = (req.files).addressProofDocument[0].originalname;
        if((req).incomeProofDocumentUrl) filteredBody.incomeProofDocument = (req).incomeProofDocumentUrl;
        for(key of Object.keys(filteredBody)){
          if(filteredBody[key]=='undefined' || filteredBody[key] == 'null'){
            filteredBody[key]=""
          }
        }
        
        const userData = await UserDetail.findByIdAndUpdate(user._id, filteredBody, {new: true});
    
        res.status(200).json({message:'Edit successful',status:'success',data: userData});

    }catch(e){
        console.log(e)
        res.status(500).json({
            message: 'Something went wrong. Try again.'
        })
    }



});

router.get("/myreferrals/:id", Authenticate, (req, res)=>{
  const {id} = req.params
  const referrals = UserDetail.find({referredBy : id}).sort({joining_date:-1})
  .then((data)=>{
      return res.status(200).json({data : data, count: data.length});
  })
  .catch((err)=>{
      return res.status(422).json({error : err})
  })
});

router.get('/earnings', Authenticate, async (req,res, next)=>{
  const id = req.user._id;
  try{
    const userReferrals = await UserDetail.findById(id).select('referrals');
    let earnings = 0;
    userReferrals.referrals.forEach((ref)=>{
      earnings += ref.referralEarning;
    });
    
    res.status(200).json({
      status:'success',
      data: {
        joined: userReferrals.referrals.length,
        earnings: earnings
      },
    });
  }catch(e){
    console.log(e);
    return res.status(500).json({status: 'error', message: 'Something went wrong'});
  }
});

router.get("/newusertoday", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const newuser = UserDetail.find({joining_date:{$gte: today}}).populate('referredBy','first_name last_name').populate('campaign','campaignName campaignCode')
  .select('joining_date referredBy campaign first_name last_name email mobile creationProcess myReferralCode')
  .sort({joining_date: -1})
  .then((data)=>{
      return res.status(200).json({data : data, count: data.length});
  })
  .catch((err)=>{
      return res.status(422).json({error : err})
  })
});

router.get("/newuseryesterday", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  date.setDate(date.getDate() - 1);
  let yesterdayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  yesterdayDate = yesterdayDate + "T00:00:00.000Z";
  const yesterday = new Date(yesterdayDate);
  const newuser = UserDetail.countDocuments({joining_date:{$gte: yesterday,$lte: today}})
  .then((data)=>{
      return res.status(200).json({count: data});
  })
  .catch((err)=>{
      return res.status(422).json({error : err})
  })
});

router.get("/newuserthismonth", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{
  
  let date = new Date();
  let monthStartDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(1).padStart(2, '0')}`
  monthStartDate = monthStartDate + "T00:00:00.000Z";
  const monthStart = new Date(monthStartDate);
  const newuser = UserDetail.countDocuments({joining_date:{$gte: monthStart}})
  .then((data)=>{
      return res.status(200).json({count: data});
  })
  .catch((err)=>{
      return res.status(422).json({error : err})
  })
});

router.get("/allusers", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{

  const newuser = UserDetail.countDocuments()
  .then((data)=>{
      return res.status(200).json({count: data});
  })
  .catch((err)=>{
      console.log("Error:",err)
      return res.status(422).json({error : err})
  })
});

router.get("/allusersNameAndId", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{

  const newuser = UserDetail.find().select('_id first_name last_name')
  .then((data)=>{
      return res.status(200).json({message: "user name and id retreived", data : data, count: data.length});
  })
  .catch((err)=>{
      console.log("Error:",err)
      return res.status(422).json({error : err})
  })
});

router.get("/newuserreferralstoday", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const newuser = UserDetail.countDocuments({joining_date:{$gte: today},referredBy : { $exists: true }})
  .then((data)=>{
      // console.log(data)
      return res.status(200).json({count: data});
  })
  .catch((err)=>{
      return res.status(422).json({error : err})
  })
});

router.get("/newuserreferralsyesterday", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  date.setDate(date.getDate() - 1);
  let yesterdayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  yesterdayDate = yesterdayDate + "T00:00:00.000Z";
  const yesterday = new Date(yesterdayDate);
  const newuser = UserDetail.countDocuments({joining_date:{$gte: yesterday,$lte: today}, referredBy :{$exists : true}})
  .then((data)=>{
      return res.status(200).json({count: data});
  })
  .catch((err)=>{
      return res.status(422).json({error : err})
  })
});

router.get("/newuserreferralsthismonth", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{
  let date = new Date();
  let monthStartDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(1).padStart(2, '0')}`
  monthStartDate = monthStartDate + "T00:00:00.000Z";
  const monthStart = new Date(monthStartDate);
  const newuser = UserDetail.countDocuments({joining_date:{$gte: monthStart}, referredBy : {$exists : true}})
  .then((data)=>{
      return res.status(200).json({count: data});
  })
  .catch((err)=>{
      return res.status(422).json({error : err})
  })
});

router.get("/allreferralsusers", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{

  const newuser = UserDetail.countDocuments({referredBy : {$exists:true}})
  .then((data)=>{
      return res.status(200).json({count: data});
  })
  .catch((err)=>{
      console.log("Error:",err)
      return res.status(422).json({error : err})
  })
});

//-----

router.get("/newusercampaigntoday", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const newuser = UserDetail.countDocuments({joining_date:{$gte: today},campaign : { $exists: true }})
  .then((data)=>{
      return res.status(200).json({count: data});
  })
  .catch((err)=>{
      return res.status(422).json({error : err})
  })
});

router.get("/newusercampaignyesterday", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  date.setDate(date.getDate() - 1);
  let yesterdayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  yesterdayDate = yesterdayDate + "T00:00:00.000Z";
  const yesterday = new Date(yesterdayDate);
  const newuser = UserDetail.countDocuments({joining_date:{$gte: yesterday,$lte: today}, campaign :{$exists : true}})
  .then((data)=>{
      return res.status(200).json({count: data});
  })
  .catch((err)=>{
      return res.status(422).json({error : err})
  })
});

router.get("/newusercampaignthismonth", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{
  let date = new Date();
  let monthStartDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(1).padStart(2, '0')}`
  monthStartDate = monthStartDate + "T00:00:00.000Z";
  const monthStart = new Date(monthStartDate);
  const newuser = UserDetail.countDocuments({joining_date:{$gte: monthStart}, campaign : {$exists : true}})
  .then((data)=>{
      return res.status(200).json({count: data});
  })
  .catch((err)=>{
      return res.status(422).json({error : err})
  })
});

router.get("/allcampaignusers", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{

  const newuser = UserDetail.countDocuments({campaign : {$exists:true}})
  .then((data)=>{
      return res.status(200).json({count: data});
  })
  .catch((err)=>{
      console.log("Error:",err)
      return res.status(422).json({error : err})
  })
});

router.get("/infinityUsers", Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{

  const role = await Role.findOne({roleName: "Infinity Trader"})

  const newuser = await UserDetail.find({role : role._id}).select('first_name last_name email _id name')
  return res.status(200).json({data : newuser, count: newuser.length});
});

router.get("/infinityTraders", Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{

  const role = await Role.findOne({roleName: "Infinity Trader"})

  const newuser = await UserDetail.find({role : role._id, designation: 'Equity Trader'})
                        .select('first_name last_name city gender dob joining_date employeeid designation referrals last_occupation location degree familyIncomePerMonth currentlyWorking latestSalaryPerMonth nonWorkingDurationInMonths email cohort profilePhoto _id stayingWith maritalStatus previouslyEmployeed')
                        .sort({cohort:-1})
  return res.status(200).json({data : newuser, count: newuser.length});

});

router.get("/normalusers", Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{

  const newuser = await UserDetail.find({designation: 'Trader'})
                        .select('first_name last_name employeeid _id email mobile')
  return res.status(200).json({data : newuser, count: newuser.length});

});

router.get("/adminAndcr", Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{
  const newuser = await UserDetail.aggregate([
    {
      $lookup: {
        from: "role-details",
        localField: "role",
        foreignField: "_id",
        as: "roles",
      },
    },
    {
      $unwind: {
        path: "$roles",
      },
    },
    {
      $match: {
        "roles.roleName": {
          $in: ["Admin", "Customer Relations"],
        },
      },
    },
    {
      $project:
        {
          first_name: 1,
          last_name: 1,
          employeeid: 1,
          _id: 1,
          email: 1,
          mobile: 1,
        },
    },
  ])
  return res.status(200).json({data : newuser, count: newuser.length});

});

module.exports = router;