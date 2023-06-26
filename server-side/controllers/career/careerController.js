const aws = require('aws-sdk');
const otpGenerator = require('otp-generator')
const {sendSMS, sendOTP} = require('../../utils/smsService');
const CareerApplication = require("../../models/Careers/careerApplicationSchema");
const InternBatch = require("../../models/Careers/internBatch");
const Career = require("../../models/Careers/careerSchema");
const User = require("../../models/User/userDetailSchema")
const PortFolio = require("../../models/userPortfolio/UserPortfolio")
const Campaign = require("../../models/campaigns/campaignSchema")
const UserWallet = require("../../models/UserWallet/userWalletSchema");
const emailService = require("../../utils/emailService")

const s3 = new aws.S3();

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el) && obj[el] !== null && obj[el] !== undefined && obj[el] !== '') {
        newObj[el] = obj[el];
      }
    });
    return newObj;
};

exports.getUploadsApplication = (async(req, res, next) => {

try {
  const { firstName, lastName, email, mobile, dob, collegeName, linkedInProfileLink, priorTradingExperience, source, career, campaignCode } = req.body;
  // console.log(req.body)
  const data = await CareerApplication.create({
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    email: email.trim(),
    mobileNo: mobile.trim(),
    dob: dob,
    collegeName: collegeName,
    linkedInProfileLink: linkedInProfileLink,
    priorTradingExperience: priorTradingExperience,
    source: source,
    // resume: uploadedData[0].url,
    career: career,
    campaignCode: campaignCode.trim(),
    });
    // console.log(data)
    res.status(201).json({message: "Your application has been submitted successfully!"});



    } catch (error) {
    // console.error(error);
    res.status(500).send({status: "error", message: "Error uploading files."});
    }

});

exports.generateOTP = async(req, res, next)=>{
  // console.log(req.body)
  const{ firstName, lastName, email, mobile, dob, collegeName, linkedInProfileLink, priorTradingExperience, source, career, campaignCode
  } = req.body
  // const applicationExists = await CareerApplication.findOne({mobileNo: mobile, career: career, status: 'OTP Verified'});
  // const emailCheck = await CareerApplication.findOne({email: email, career: career, status: 'OTP Verified'});
  // console.log("Application Exists: ",applicationExists)
  // if(applicationExists){
  //   return res.status(400).json({info:'You have already applied for this position using this mobile number.'})
  // }
  // if(emailCheck){
  //   return res.status(400).json({info:'You have already applied for this position using this email.'})
  // }
  let mobile_otp = otpGenerator.generate(6, {digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
  try {
      const data = await CareerApplication.create({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      mobileNo: mobile.trim(),
      dob: dob,
      collegeName: collegeName,
      linkedInProfileLink: linkedInProfileLink,
      priorTradingExperience: priorTradingExperience,
      source: source.trim(),
      career: career,
      campaignCode: campaignCode.trim(),
      mobile_otp: mobile_otp,
      status: 'OTP Verification Pending',
      applicationStatus: 'Applied'
      });
      // console.log(data)
      sendOTP(mobile.toString(), mobile_otp);
      if(!process.env.PROD)sendOTP("9319671094", mobile_otp);
      res.status(201).json({info: "OTP Sent on your mobile number!"}); 
  }catch(error){
    console.log(error)
  }
}

exports.confirmOTP = async(req, res, next)=>{
  
  const{ firstName, lastName, email, mobile, dob, collegeName, linkedInProfileLink, priorTradingExperience, source, career, campaignCode, mobile_otp
  } = req.body
  // console.log(req.body)
  const correctOTP = await CareerApplication.findOne({$or : [{mobile: mobile}], mobile_otp: mobile_otp})
  // console.log(correctOTP)
  if(!correctOTP){
    return res.status(400).json({info:'Please enter the correct OTP'})
  }

  correctOTP.status = 'OTP Verified'
  await correctOTP.save({validateBeforeSave:false})
  res.status(201).json({info:"Application Submitted Successfully."})
  const existingUser = await User.findOne({mobile: mobile})
  // if(existingUser){
  //   return res.status(400).json({info:"User Already Exists"})
  // }

  let campaign;
    if(campaignCode){
      campaign = await Campaign.findOne({campaignCode:campaignCode})
    }
  
    async function generateUniqueReferralCode() {
      const length = 8; // change this to modify the length of the referral code
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let myReferralCode = '';
      let codeExists = true;
  
      // Keep generating new codes until a unique one is found
      while (codeExists) {
          for (let i = 0; i < length; i++) {
              myReferralCode += chars.charAt(Math.floor(Math.random() * chars.length));
          }
  
          // Check if the generated code already exists in the database
          const existingCode = await User.findOne({ myReferralCode: myReferralCode });
          if (!existingCode) {
          codeExists = false;
          }
      }
  
      return myReferralCode;
      }

  if(!existingUser){
  const myReferralCode = generateUniqueReferralCode();
  let userId = email.split('@')[0]
  const userIds = await User.find({employeeid:userId})
  // console.log("User Ids: ",userIds)
    if(userIds.length > 0)
    {
        userId = userId?.toString()+(userIds?.length+1).toString()
    }

  const activeFreePortfolios = await PortFolio.find({status: "Active", portfolioAccount: "Free"});
        let portfolioArr = [];
        for (const portfolio of activeFreePortfolios) {
            let obj = {};
            obj.portfolioId = portfolio._id;
            obj.activationDate = new Date();
            portfolioArr.push(obj);
        }

  try{
    let obj = {
        first_name : firstName.trim(), 
        last_name : lastName.trim(), 
        designation: 'Trader', 
        email : email, 
        mobile : mobile,
        name: firstName.trim() + ' ' + lastName.trim().substring(0,1), 
        password: 'sh' + lastName.trim() + '@123' + mobile.trim().slice(1,3), 
        status: 'Active', 
        employeeid: userId, 
        creationProcess: 'Career SignUp',
        joining_date:new Date(),
        myReferralCode:(await myReferralCode).toString(), 
        portfolio: portfolioArr,
        campaign: campaign && campaign._id,
        campaignCode: campaign && campaignCode,
    }

        const newuser = await User.create(obj);
        const token = await newuser.generateAuthToken();

        const idOfUser = newuser._id;

        for (const portfolio of activeFreePortfolios) {
          const portfolioValue = portfolio.portfolioValue;
          
          await PortFolio.findByIdAndUpdate(
              portfolio._id,
              { $push: { users: { userId: idOfUser, portfolioValue: portfolioValue } } }
              );
          }
        
        // console.log("Campaign: ",campaign)
        if(campaign){
            // console.log("Inside setting user to campaign")
            campaign?.users?.push({userId:newuser._id,joinedOn: new Date()})
            const campaignData = await Campaign.findOneAndUpdate({_id: campaign._id}, {
                $set:{ 
                    users: campaign?.users
                }
            })
            // console.log(campaignData)
        }

        await UserWallet.create(
          {
              userId: newuser._id,
              createdOn: new Date(),
              createdBy:newuser._id
        })

        // res.status(201).json({status: "Success", data:newuser, token: token, message:"Welcome! Your account is created, please check your email for your userid and password details."});
            // let email = newuser.email;
            let subject = "Account Created - StoxHero";
            let message = 
            `
            <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Account Created</title>
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
                    <h1>Account Created</h1>
                    <p>Hello ${newuser.first_name},</p>
                    <p>Your login details are:</p>
                    <p>User ID: <span class="userid">${newuser?.email}</span></p>
                    <p>Password: <span class="password">sh${newuser.last_name?.trim()}@123${newuser?.mobile?.slice(1,3)}</span></p>
                    <p>Please use these credentials to log in to our website:</p>
                    <a href="https://www.stoxhero.com/" class="login-button">Log In</a>
                    </div>
                </body>
                </html>

            `
            emailService(newuser?.email,subject,message);
  
  }catch(error){
    console.log(error)
  }
  }
}
  

exports.createCareer = async(req, res, next)=>{
    // console.log(req.body)
    const{
        jobTitle, jobDescription, rolesAndResponsibilities, jobType, jobLocation,
        status, listingType } = req.body;
    if(await Career.findOne({jobTitle, status: "Live" })) return res.status(400).json({info:'This job post is already live.'});

    const career = await Career.create({jobTitle: jobTitle.trim(), jobDescription, rolesAndResponsibilities, jobType, jobLocation,
        status, createdBy: req.user._id, lastModifiedBy: req.user._id, listingType});
    // console.log("Career: ",career)
    res.status(201).json({message: 'Career post successfully created.', data:career});
}

exports.editCareer = async(req, res, next) => {
    const id = req.params.id;

    // console.log("id is ,", id)
    const career = await Career.findById(id);

    const filteredBody = filterObj(req.body, "jobTitle", "jobDescription", "jobType", "jobLocation", "status");
    if(req.body.rolesAndResponsibilities)filteredBody.rolesAndResponsibilities=[...career.rolesAndResponsibilities,
        {orderNo:req.body.rolesAndResponsibilities.orderNo,
            description:req.body.rolesAndResponsibilities.description,}]
    filteredBody.lastModifiedBy = req.user._id;    

    // console.log(filteredBody)
    const updated = await Career.findByIdAndUpdate(id, filteredBody, { new: true });

    res.status(200).json({message: 'Successfully edited Career.', data: updated});
}

exports.getCareers = async(req, res, next)=>{
    const type = req.query.type;
    const cond = !type? {}:{listingType:type}
    const career = await Career.aggregate(
      [
        {
          $match: cond
        },
        {
          $lookup: {
            from: "career-applications",
            localField: "_id",
            foreignField: "career",
            as: "applicants",
          },
        },
        {
          $match: {
            status: "Live",
          },
        },
        {
          $project: {
            jobTitle: 1,
            jobDescription: 1,
            jobType: 1,
            jobLocation: 1,
            status: 1,
            applicants: 1,
            rolesAndResponsibilities: 1,
            listingType: 1
          },
        },
      ]
    )
    res.status(201).json({message: 'success', data:career});
}

exports.getCareer = async (req,res,next) => {
  // console.log("inside getCareer")
  const {id} = req.params;
  try {
      const career = await Career.find({_id: id})

      // console.log("Career: ",career)
      if (!career) {
        return res.status(200).json({ status: 'success', message: 'Career not found.', data: {} });
      }
        return res.status(200).json({ status: 'success', message: 'Successful', data: career });
    } catch (e) {
      // console.log(e);
      res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
}

exports.getCareerApplicantions = async(req, res, next)=>{
  const {id} = req.params;
  const careerApplications = await CareerApplication.find({career: id, applicationStatus:'Applied'})
                              .sort({_id:-1})
                              .select('first_name last_name mobileNo email collegeName dob appliedOn priorTradingExperience source campaignCode applicationStatus linkedInProfileLink')
  res.status(201).json({message: 'success', data:careerApplications, count:careerApplications.length});
}

exports.getSelectedCareerApplicantions = async(req, res, next)=>{
  const {id} = req.params;
  const careerApplications = await CareerApplication.find({career: id, $or:[
    {applicationStatus: 'Shortlisted'}, 
    {applicationStatus: 'Selected'}
  ]}).select('first_name last_name mobileNo email collegeName dob appliedOn priorTradingExperience source campaignCode applicationStatus')
  res.status(201).json({message: 'success', data:careerApplications, count:careerApplications.length});
}