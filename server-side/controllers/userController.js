const multer = require('multer');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const UserDetail = require('../models/User/userDetailSchema');


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

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


const resizePhoto = async (req, res, next) => {
    console.log('resize func');
    console.log("Uploaded Files: ",req.files)
    if (!req.files) {
      // no file uploaded, skip to next middleware
      console.log('no file');
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
          .resize({ width: 1024, height: 720 })
          .toBuffer();
          (req.files).aadhaarCardFrontImageBuffer = resizedAadhaarCardFrontImage;
      }
      if (aadhaarCardBackImage && aadhaarCardBackImage[0].buffer) {
        const resizedAadhaarCardBackImage = await sharp(aadhaarCardBackImage[0].buffer)
          .resize({ width: 1024, height: 720 })
          .toBuffer();
          (req.files).aadhaarCardBackImageBuffer = resizedAadhaarCardBackImage;
      }

      if (panCardFrontImage && panCardFrontImage[0].buffer) {
        const resizedPanCardFrontImage = await sharp(panCardFrontImage[0].buffer)
          .resize({ width: 1024, height: 720 })
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
          .resize({ width: 1024, height: 720 })
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
      console.log('no files bro');
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
        console.log('file uploaded');
        console.log(s3Data.Location);
        (req).profilePhotoUrl = s3Data.Location;
      }
  
      if ((req.files).aadhaarCardFrontImage) {
        let userName;
        const user = await UserDetail.findById(req.params.id);
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
        console.log('file uploaded');
        console.log(s3Data.Location);
        (req).aadhaarCardFrontImageUrl = s3Data.Location;
      }

      if ((req.files).aadhaarCardBackImage) {
        let userName;
        const user = await UserDetail.findById(req.params.id);
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
        console.log('file uploaded');
        console.log(s3Data.Location);
        (req).aadhaarCardBackImageUrl = s3Data.Location;
      }
      if ((req.files).panCardFrontImage) {
        let userName;
        const user = await UserDetail.findById(req.params.id);
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
        console.log('file uploaded');
        console.log(s3Data.Location);
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
        console.log('file uploaded');
        console.log(s3Data.Location);
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
        console.log('file uploaded');
        console.log(s3Data.Location);
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
        console.log('file uploaded');
        console.log(s3Data.Location);
        (req).incomeProofDocumentUrl = s3Data.Location;
      }
  
      console.log('calling next of s3 upload func');
      next();
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Error uploading to S3' });
    }
  };



exports.editUser = async(req, res, next) => {
        console.log(req.body)
        try{
            const user = await UserDetail.findById(req.user._id);
        
            if(!user) return res.status(404).json({message: 'No such user found.'});
        
            const filteredBody = filterObj(req.body,'status', 'uId', 'createdOn', 'lastModified', 'createdBy', 'name', 
            'first_name', 'last_name', 'cohort', 'designation', 'email', 'maritalStatus', 'currentlyWorking', 
            'previouslyEmployeed', 'latestSalaryPerMonth', 'familyIncomePerMonth', 'collegeName', 'stayingWith', 
            'nonWorkingDurationInMonths', 'mobile', 'mobile_otp', 'whatsApp_number', 'degree', 'dob', 'gender', 
            'address', 'trading_exp', 'location', 'city', 'state', 'country', 'last_occupation', 'family_yearly_income', 
            'joining_date', 'purpose_of_joining', 'employeed', 'role', 'creationProcess', 'employeeid', 'pincode', 'upiId', 
            'googlePay_number', 'payTM_number', 'phonePe_number', 'bankName', 'nameAsPerBankAccount', 'accountNumber', 'ifscCode', 
            'password', 'resetPasswordOTP', 'resetPasswordExpires', 'passwordChangedAt', 'userId', 'fund', 'aadhaarNumber', 
            'panNumber', 'drivingLicenseNumber', 'passportNumber', 'KYCStatus', 'myReferralCode', 'referrerCode', 
            'referredBy', 'campaignCode', 'campaign', 'contests', 'portfolio', 'isAlgoTrader'
            );
    
            filteredBody.lastModifiedBy = req.user._id;
            console.log("Profile Photo Url: ",req.profilePhotoUrl)
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
            console.log(filteredBody)
            const userData = await UserDetail.findByIdAndUpdate(user._id, filteredBody, {new: true});
            console.log(userData);
        
            res.status(200).json({message:'Edit successful',status:'success',data: userData});
    
        }catch(e){
            console.log(e)
            res.status(500).json({
                message: 'Something went wrong. Try again.'
            })
        }
    
    
    
    
}

exports.changePassword = async (req, res) => {
    try {
      // Check if user exists
      const user = await UserDetail.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }
      
      // Check if current password is correct
      const isPasswordCorrect = await user.correctPassword(req.body.currentPassword, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({
          status:'error',  
          message: 'Current password is incorrect'
        });
      }
      
      // Update the password and save the user
      user.password = req.body.newPassword;
      user.passwordChangedAt = new Date();
      const updatedUser = await user.save({validateBeforeSave:false});
  
      // Generate a new JWT token for the user
      const token = await updatedUser.generateAuthToken();
      
      res.status(200).json({
        status:'success',
        message: 'Password updated successfully',
        token: token
      });
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while changing password'
      });
    }
  };