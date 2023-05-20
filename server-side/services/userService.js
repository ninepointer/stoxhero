const CareerApplication = require("../../models/Careers/careerApplicationSchema");
const Career = require("../models/Careers/careerSchema");
const User = require("../models/User/userDetailSchema");
const PortFolio = require("../models/userPortfolio/UserPortfolio")
const Campaign = require("../models/campaigns/campaignSchema")
const UserWallet = require("../models/UserWallet/userWalletSchema");
const emailService = require("../utils/emailService");



exports.createUser = async({email, mobile})=>{
  
    const existingUser = await User.findOne({$or :[{email:email,mobile: mobile}]})
    // if(existingUser){
    //   return res.status(400).json({info:"User Already Exists"})
    // }
  
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
    const userId = email.split('@')[0]
    const userIds = await User.find({employeeid:userId})
    console.log("User Ids: ",userIds)
      if(userIds.length > 0)
      {
          userId = userId.toString()+(userIds.length+1).toString()
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
          first_name : firstName, 
          last_name : lastName, 
          designation: 'Trader', 
          email : email, 
          mobile : mobile,
          name: firstName + ' ' + lastName.substring(0,1), 
          password: 'sh' + lastName.trim() + '@123' + mobile.slice(1,3), 
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
  
          // res.cookie("jwtoken", token, {
          //     expires: new Date(Date.now() + 25892000000),
          //     httpOnly: true
          // });
          
          // console.log("token", token);
          // res.status(201).json({status: "Success", data:newuser, token: token, message:"Welcome! Your account is created, please check your email for your userid and password details."});
          const idOfUser = newuser._id;
  
          for (const portfolio of activeFreePortfolios) {
            const portfolioValue = portfolio.portfolioValue;
            
            await PortFolio.findByIdAndUpdate(
                portfolio._id,
                { $push: { users: { userId: idOfUser, portfolioValue: portfolioValue } } }
                );
            }
          
          console.log("Campaign: ",campaign)
          if(campaign){
              console.log("Inside setting user to campaign")
              campaign?.users?.push({userId:newuser._id,joinedOn: new Date()})
              const campaignData = await Campaign.findOneAndUpdate({_id: campaign._id}, {
                  $set:{ 
                      users: campaign?.users
                  }
              })
              console.log(campaignData)
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
                      <p>User ID: <span class="userid">${newuser.email}</span></p>
                      <p>Password: <span class="password">sh${newuser.last_name.trim()}@123${newuser.mobile.slice(1,3)}</span></p>
                      <p>Please use these credentials to log in to our website:</p>
                      <a href="https://www.stoxhero.com/" class="login-button">Log In</a>
                      </div>
                  </body>
                  </html>
  
              `
              emailService(newuser.email,subject,message);
    
    }catch(error){
      console.log(error)
    }
    }
  }