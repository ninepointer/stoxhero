const TenXSubscription = require("../models/TenXSubscription/TenXSubscriptionSchema");
const TenXPurchaseIntent = require("../models/TenXSubscription/TenXPurchaseIntentSchema");
const TenXTutorialView = require("../models/TenXSubscription/TenXVideoTutorialSchema");
const { ObjectId } = require("mongodb");
const TenXTrader = require("../models/mock-trade/tenXTraderSchema");
const User = require("../models/User/userDetailSchema");
const Campaign = require("../models/campaigns/campaignSchema")
const Wallet = require("../models/UserWallet/userWalletSchema");
const uuid = require('uuid');
const {client, getValue} = require("../marketData/redisClient");
const emailService = require("../utils/emailService");
const mongoose = require('mongoose');
const {createUserNotification} = require('./notification/notificationController');
const Product = require('../models/Product/product');
const Coupon = require('../models/coupon/coupon');
const Setting = require('../models/settings/setting');
const {saveSuccessfulCouponUse} = require('./coupon/couponController');
const AffiliateProgram = require('../models/affiliateProgram/affiliateProgram');
const{creditAffiliateAmount} = require('./affiliateProgramme/affiliateController');


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el) && obj[el] !== null && obj[el] !== undefined && obj[el] !== '') {
        newObj[el] = obj[el];
      }
    });
    return newObj;
};

exports.createTenXSubscription = async(req, res, next)=>{
    // console.log(req.body)
    const{
        plan_name, actual_price, discounted_price, features, validity, validityPeriod,
        status, portfolio, profitCap, allowPurchase, allowRenewal, payoutPercentage, expiryDays } = req.body;
    if(await TenXSubscription.findOne({plan_name, status: "Active" })) return res.status(400).json({message:'This subscription already exists.'});

    const tenXSubs = await TenXSubscription.create({plan_name:plan_name.trim(), actual_price, discounted_price, features, validity, validityPeriod,
        status, createdBy: req.user._id, lastModifiedBy: req.user._id, portfolio, profitCap, allowPurchase, allowRenewal, payoutPercentage, expiryDays});
    
    res.status(201).json({message: 'TenX Subscription successfully created.', data:tenXSubs});
}

exports.editTanx = async(req, res, next) => {
    const id = req.params.id;

    // console.log("id is ,", id)
    const tenx = await TenXSubscription.findById(id);

    const filteredBody = filterObj(req.body, "plan_name", "actual_price", "discounted_price", "validity", "validityPeriod", 
        "status", "profitCap", "portfolio", "allowPurchase", "allowRenewal", "payoutPercentage", "expiryDays");
    if(req.body.features)filteredBody.features=[...tenx.features,
        {orderNo:req.body.features.orderNo,
            description:req.body.features.description,}]
    filteredBody.lastModifiedBy = req.user._id;    

    // console.log(filteredBody)
    const updated = await TenXSubscription.findByIdAndUpdate(id, filteredBody, { new: true });

    res.status(200).json({message: 'Successfully edited tenx.', data: updated});
}

exports.editFeature = async(req, res, next) => {
    const id = req.params.id;
    const {orderNo, description} = req.body;

    // console.log("id is ,", id)
    const updated = await TenXSubscription.findOneAndUpdate(
        { "features._id": id }, // filter to match the feature object with the given _id
        {
          $set: {
            "features.$.orderNo": orderNo, // set the new orderNo value
            "features.$.description": description, // set the new description value
            lastModifiedBy: req.user._id // set the lastModifiedBy value to the current user's _id
          }
        },
        { new: true } // return the updated document
      );
    res.status(200).json({message: 'Successfully edited tenx.', data: updated});
}

exports.removeFeature = async(req, res, next) => {
    const id = req.params.id;
    // const {orderNo, description} = req.body;

    // console.log("id is ,", id)
    const updatedDoc = await TenXSubscription.findOneAndUpdate(
        { "features._id": id }, // filter to match the feature object with the given _id
        {
          $pull: { features: { _id: id } }, // remove the feature object with the given _id
          lastModifiedBy: req.user._id // set the lastModifiedBy value to the current user's _id
        },
        { new: true } // return the updated document
      );
    res.status(200).json({message: 'Successfully deleted tenx.', data: updatedDoc});
}

exports.getActiveTenXSubs = async(req, res, next)=>{
    try{
        const tenXSubs = await TenXSubscription.find({status: "Active"}).select('actual_price discounted_price plan_name portfolio profitCap status validity validityPeriod features allowPurchase allowRenewal expiryDays payoutPercentage')
        .populate('portfolio', 'portfolioName portfolioValue')
        .sort({discounted_price: 1})
        
        res.status(201).json({status: 'success', data: tenXSubs, results: tenXSubs.length});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }     
};

exports.getAdminActiveTenXSubs = async(req, res, next)=>{
  try{
      const tenXSubs = await TenXSubscription.find({status: "Active"}).select('actual_price discounted_price plan_name portfolio profitCap status validity validityPeriod features users payoutPercentage expiryDays')
      .populate('portfolio', 'portfolioName portfolioValue')
      .sort({discounted_price: -1})
      
      res.status(201).json({status: 'success', data: tenXSubs, results: tenXSubs.length});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};

exports.getAllTenXSubs = async(req, res, next)=>{
  try{
      const tenXSubs = await TenXSubscription.find().select('actual_price discounted_price plan_name portfolio profitCap status validity validityPeriod features users expiryDays payoutPercentage')
      .populate('portfolio', 'portfolioName portfolioValue')
      .sort({discounted_price: -1})
      
      res.status(201).json({status: 'success', data: tenXSubs, results: tenXSubs.length});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};

// {trader: ObjectId('648fe5463a4a89e10e1f367e'), subscriptionId: ObjectId('645cc7162f0bba5a7a3ff40a'), status: "COMPLETE", trade_time: {$gte: new Date("2023-07-09"), $lt: new Date("2023-07-11")}}

exports.getInactiveTenXSubs = async(req, res, next)=>{
  try{
      const tenXSubs = await TenXSubscription.find({status: "Inactive"})
      .populate('portfolio', 'portfolioName portfolioValue')
      .sort({discounted_price: -1})
      
      res.status(201).json({status: 'success', data: tenXSubs, results: tenXSubs.length});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }
      
};

exports.getDraftTenXSubs = async(req, res, next)=>{
  try{
      const tenXSubs = await TenXSubscription.find({status: "Draft"})
      .populate('portfolio', 'portfolioName portfolioValue')
      .sort({discounted_price: -1})
      
      res.status(201).json({status: 'success', data: tenXSubs, results: tenXSubs.length});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }
      
};

exports.getTenXSubscription = async(req, res, next)=>{
    
    const id = req.params.id ? req.params.id : '';
    try{
    const tenXSubscription = await TenXSubscription.findById(id)
    .populate('portfolio', 'portfolioName portfolioValue')
    .populate('users.userId','first_name last_name mobile email')
    .sort({discounted_price: -1});

    res.status(201).json({message: "TenXSubscription Retrived",data: tenXSubscription});    
    }
    catch{(err)=>{res.status(401).json({message: "New TenXSubscription", error:err}); }}  
};

exports.createTenXPurchaseIntent = async(req, res, next)=>{
  // console.log(req.body)
  try{
  const{ purchase_intent_by, tenXSubscription } = req.body;

  const tenXPurchaseIntent = await TenXPurchaseIntent.create({purchase_intent_by, tenXSubscription});
  
  const user = await User.findOne(
    { _id: purchase_intent_by }
    );

  const referredBy = await User.findOne(
    { _id: user.referredBy }
    );

  const campaign = await Campaign.findOne(
    { _id: user.campaign }
    );

  const tenX = await TenXSubscription.findOne(
    { _id: tenXSubscription }
    ).select('plan_name discounted_price actual_price expiryDays validity validityPeriod profitCap')
    .populate('portfolio','portfolioValue');

  let recipients = ['team@stoxhero.com'];
  let recipientString = recipients.join(",");
  let subject = `TenX Purchase Intent by ${user.first_name} ${user.last_name}`;
  let message = 
  `
  <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Subscription Renewed</title>
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
          <h1>TenX Purchase Intent</h1>
          <p>Hello Team,</p>
          <p>The below trader showed a purchase intent for TenX Subscription.</p>
          <p>User ID: <span class="userid">${user.employeeid}</span></p>
          <p>Full Name: <span class="password">${user.first_name} ${user.last_name}</span></p>
          <p>Email: <span class="password">${user.email}</span></p>
          <p>Mobile: <span class="password">${user.mobile}</span></p>
          <p>Signup Method: <span class="password">${user.creationProcess ? user.creationProcess : 'NA'}</span></p>
          <p>Campaign: <span class="password">${campaign ? campaign.campaignName : 'NA'}</span></p>
          <p>Referred By: <span class="password">${referredBy ? referredBy.first_name : 'NA'} ${referredBy ? referredBy.last_name : ''}</span></p>
          <p>Subscription Name: <span class="password">${tenX.plan_name}</span></p>
          <p>Subscription Actual Price: <span class="password">₹${tenX.actual_price}/-</span></p>
          <p>Subscription Discounted Price: <span class="password">₹${tenX.discounted_price}/-</span></p>
          <p>Portfolio Value: <span class="password">₹${tenX.portfolio.portfolioValue}/-</span></p>
          <p>Profit Cap: <span class="password">₹${tenX.profitCap}/-</span></p>    
          <p>Completion: <span class="password">${tenX.validity} trading ${tenX.validityPeriod}</span></p>  
          <p>Expiry: <span class="password">${tenX.expiryDays} calendar days</span></p>          
          </div>
      </body>
      </html>

  `
  if(process.env.PROD === "true"){
    emailService(recipientString,subject,message);
  }

  res.status(201).json({message: 'TenX Purchase Intent Captured Successfully.', data:tenXPurchaseIntent});
  }
  catch{(err)=>{res.status(401).json({message: "Something went wrong", error:err}); }}  
}

exports.createTenXTutorialView = async(req, res, next)=>{
  
  try{
  const{ tutorialViewedBy, tenXSubscription } = req.body;

  const tenXTutorialView = (await TenXTutorialView.create({tutorialViewedBy, tenXSubscription}));

  const user = await User.findOne(
    { _id: tutorialViewedBy }
    );

  const referredBy = await User.findOne(
    { _id: user.referredBy }
    );

  const campaign = await Campaign.findOne(
    { _id: user.campaign }
    );

  const tenX = await TenXSubscription.findOne(
    { _id: tenXSubscription }
    ).select('plan_name discounted_price actual_price expiryDays validity validityPeriod profitCap')
    .populate('portfolio','portfolioValue');

      let recipients = ['team@stoxhero.com'];
      let recipientString = recipients.join(",");
      let subject = `TenX Tutorial Video View by ${user.first_name} ${user.last_name}`;
      let message = 
      `
      <!DOCTYPE html>
          <html>
          <head>
              <meta charset="UTF-8">
              <title>Subscription Renewed</title>
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
              <h1>TenX Tutorial View</h1>
              <p>Hello Team,</p>
              <p>The below trader viewed the TenX tutorial video.</p>
              <p>User ID: <span class="userid">${user.employeeid}</span></p>
              <p>Full Name: <span class="password">${user.first_name} ${user.last_name}</span></p>
              <p>Email: <span class="password">${user.email}</span></p>
              <p>Mobile: <span class="password">${user.mobile}</span></p>
              <p>Signup Method: <span class="password">${user.creationProcess ? user.creationProcess : 'NA'}</span></p>
              <p>Campaign: <span class="password">${campaign ? campaign.campaignName : 'NA'}</span></p>
              <p>Referred By: <span class="password">${referredBy ? referredBy.first_name : 'NA'} ${referredBy ? referredBy.last_name : ''}</span></p>
              <p>Subscription Name: <span class="password">${tenX.plan_name}</span></p>
              <p>Subscription Actual Price: <span class="password">₹${tenX.actual_price}/-</span></p>
              <p>Subscription Discounted Price: <span class="password">₹${tenX.discounted_price}/-</span></p>
              <p>Portfolio Value: <span class="password">₹${tenX.portfolio.portfolioValue}/-</span></p>
              <p>Profit Cap: <span class="password">₹${tenX.profitCap}/-</span></p>    
              <p>Completion: <span class="password">${tenX.validity} trading ${tenX.validityPeriod}</span></p>  
              <p>Expiry: <span class="password">${tenX.expiryDays} calendar days</span></p>          
              </div>
          </body>
          </html>

      `
      if(process.env.PROD === "true"){
        emailService(recipientString,subject,message);
      }

  res.status(201).json({message: 'TenX Tutorial View Captured Successfully.', data:tenXTutorialView});
  }
  catch{(err)=>{res.status(401).json({message: "Something went wrong", error:err}); }}  
}

exports.getTenXSubscriptionPurchaseIntent = async(req, res, next)=>{
  const id = req.params.id ? req.params.id : '';
  try{
      const purchaseIntent = await TenXPurchaseIntent.find({tenXSubscription : id})
      .populate('purchase_intent_by', 'first_name last_name mobile email joining_date creationProcess')

      res.status(201).json({status: 'success', data: purchaseIntent, count: purchaseIntent.length});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }   
};

exports.getTenXTutorialVideoView = async(req, res, next)=>{
  const id = req.params.id ? req.params.id : '';
  try{
      const tutorialviews = await TenXTutorialView.find({tenXSubscription : id})
      .populate('tutorialViewedBy', 'first_name last_name mobile email joining_date creationProcess')

      res.status(201).json({status: 'success', data: tutorialviews, count: tutorialviews.length});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }   
};

exports.getBeginnerSubscription = async(req, res, next)=>{
  try{
      const tenXSubs = await TenXSubscription.findOne({plan_name: "Beginner"})
      
      res.status(201).json({status: 'success', data: tenXSubs, results: tenXSubs?.users?.length});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};

exports.getIntermediateSubscription = async(req, res, next)=>{
  try{
      const tenXSubs = await TenXSubscription.findOne({plan_name: "Intermediate"})
      
      res.status(201).json({status: 'success', data: tenXSubs, results: tenXSubs?.users?.length});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};

exports.getProSubscription = async(req, res, next)=>{
  try{
      const tenXSubs = await TenXSubscription.findOne({plan_name: "Pro"})
      
      res.status(201).json({status: 'success', data: tenXSubs, results: tenXSubs?.users?.length});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};

exports.renewSubscription = async(req, res, next)=>{
  let isRedisConnected = getValue();
  const userId = req.user._id;
  const {subscriptionAmount, subscriptionName, subscriptionId, coupon, bonusRedemption} = req.body;
  const result = await exports.handleSubscriptionRenewal(userId, subscriptionAmount, subscriptionName, subscriptionId, isRedisConnected, coupon, bonusRedemption);
  res.status(result.statusCode).json(result.data);     
};

exports.handleSubscriptionRenewal = async (userId, subscriptionAmount, subscriptionName, subscriptionId, isRedisConnected, coupon, bonusRedemption) =>{
  const today = new Date();
  const session = await mongoose.startSession();
  try{
    let affiliate, affiliateProgram;
    let discountAmount =0;
    let cashbackAmount =0;
    session.startTransaction();
    const tenXSubs = await TenXSubscription.findOne({_id: new ObjectId(subscriptionId)})
    if(!subscriptionAmount){
      subscriptionAmount = tenXSubs?.discounted_price;
    }
    
    const setting = await Setting.find({});
    const wallet = await Wallet.findOne({userId: userId});
    let amount = 0;
    let bonusAmount = 0;
    for(elem of wallet.transactions){
      if(elem?.transactionType == 'Cash'){
        amount += elem.amount;
      }
      else if(elem?.transactionType == 'Bonus'){
        bonusAmount += elem.amount;  
      }  
    }
    if(bonusRedemption > bonusAmount || bonusRedemption > tenXSubs?.discounted_price*setting[0]?.maxBonusRedemptionPercentage){
      return {
        statusCode:400,
        data:{
        status: "error",
        message:"Incorrect HeroCash Redemption",
        }
      }; 
    }
    if(Number(bonusRedemption)){
      wallet?.transactions?.push({
          title: 'StoxHero HeroCash Redeemed',
          description: `${bonusRedemption} HeroCash used.`,
          transactionDate: new Date(),
          amount:-(bonusRedemption?.toFixed(2)),
          transactionId: uuid.v4(),
          transactionType: 'Bonus'
      });
    }  
    if(coupon){
      const couponDoc = await Coupon.findOne({code:coupon});
      if(!couponDoc){
        const affiliatePrograms = await AffiliateProgram.find({status:'Active'});
        if(affiliatePrograms.length != 0)
            for(program of affiliatePrograms){
                let match = program?.affiliates?.find(item => item?.affiliateCode?.toString() == coupon?.toString());
                if(match){
                    affiliate = match;
                    affiliateProgram = program;
                    couponDoc = {rewardType: 'Discount', discountType:'Percentage', discount: program?.discount, maxDiscount:program?.maxDiscount }
                }
            }

    }
      if(couponDoc?.rewardType == 'Discount'){
          if(couponDoc?.discountType == 'Flat'){
              //Calculate amount and match
              discountAmount = couponDoc?.discount;
          }else{
              discountAmount = Math.min(couponDoc?.discount/100*tenXSubs?.discounted_price, couponDoc?.maxDiscount);
              
          }
      }else{
        if(couponDoc?.discountType == 'Flat'){
          //Calculate amount and match
          cashbackAmount = couponDoc?.discount;
      }else{
          cashbackAmount = Math.min(couponDoc?.discount/100*(tenXSubs?.discounted_price-bonusRedemption), couponDoc?.maxDiscount);
          
      }
      wallet?.transactions?.push({
          title: 'StoxHero CashBack',
          description: `Cashback of ${cashbackAmount?.toFixed(2)} HeroCash - code ${coupon} used`,
          transactionDate: new Date(),
          amount:cashbackAmount?.toFixed(2),
          transactionId: uuid.v4(),
          transactionType: 'Bonus'
      });
    }
  }

  const totalAmount = (tenXSubs?.discounted_price - discountAmount -bonusRedemption)*(1+setting[0]?.gstPercentage/100)
  console.log(Number(totalAmount) , Number(subscriptionAmount))
  if(Number(totalAmount) != Number(subscriptionAmount)){
    return {
      statusCode:400,
      data:{
      status: "error",
      message:"Incorrect TenX fee amount",
      }
    };  
  } 
    if(amount < subscriptionAmount){
      return {
        statusCode:400,
        data:{
          status: "error",
          message: "You do not have sufficient funds to renew this subscription. Please add money to your wallet."
        }
    };
    }
    if(!tenXSubs.allowRenewal){
      return {
        statusCode:404,
        data:{
          status: "error",
          message: "This subscription is no longer available for purchase or renewal. Please purchase a different plan."
        }
    };
    }
    const users = tenXSubs.users;
    const Subslen = tenXSubs.users.length;
    for (let j = 0; j < users.length; j++) {
      if(users[j].userId.toString() === userId.toString()){
        const status = users[j].status;
        const subscribedOn = users[j].subscribedOn;

        if(status === "Live"){
          // console.log(new Date(subscribedOn))

          const user = await User.findOne({ _id: new ObjectId(userId) });
          let len = user.subscription.length;
          
          for (let k = len - 1; k >= 0; k--) {
            if (user.subscription[k].subscriptionId?.toString() === tenXSubs._id?.toString()) {
              user.subscription[k].status = "Expired";
              user.subscription[k].expiredOn = new Date();
              user.subscription[k].expiredBy = "User";
              // console.log("this is user", user)
              await user.save({session});
              break;
            }
          }
          
          for (let k = Subslen - 1; k >= 0; k--) {
            if (tenXSubs.users[k].userId?.toString() === userId?.toString()) {
              tenXSubs.users[k].status = "Expired";
              tenXSubs.users[k].expiredOn = new Date();
              tenXSubs.users[k].expiredBy = "User";
              // console.log("this is tenXSubs", tenXSubs)
              await tenXSubs.save({session});
              break;
            }
          }
        }
      }
    }
      
    for(let i = 0; i < tenXSubs.users.length; i++){
        if(tenXSubs.users[i].userId.toString() == userId.toString() && tenXSubs.users[i].status == "Live"){
          return {
            statusCode:400,
            data:{
              status: "error",
              message: "Something went wrong"
            }
        };
        }
    }


    // const wallet = await Wallet.findOne({userId: userId});
    wallet.transactions = [...wallet.transactions, {
          title: 'Bought TenX Trading Subscription',
          description: `Amount deducted for the purchase of ${subscriptionName} subscription`,
          amount: (-subscriptionAmount),
          transactionId: uuid.v4(),
          transactionType: 'Cash'
    }];
    await wallet.save({session});

    const user = await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            subscription: {
              subscriptionId: new ObjectId(subscriptionId),
              subscribedOn: new Date(),
              isRenew: true,
              fee: subscriptionAmount,
              bonusRedemption: bonusRedemption??0
            }
          }
        },
        { new: true, session:session }
    );

    const subscription = await TenXSubscription.findOneAndUpdate(
    { _id: new ObjectId(subscriptionId) },
    {
        $push: {
          users: {
              userId: new ObjectId(userId),
              subscribedOn: new Date(),
              isRenew: true,
              fee: subscriptionAmount,
              bonusRedemption: bonusRedemption ?? 0
          }
        }
    },
    { new: true, session:session }
    );

    if(isRedisConnected){
      await client.del(`${user._id.toString()}authenticatedUser`);
      await client.del(`${userId.toString()}${subscriptionId.toString()} openingBalanceAndMarginTenx`)
      await client.del(`${userId.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)
    }

    if(!wallet){
      return {
        statusCode:404,
        data:{
          status: "error",
          message: "Not found"
        }
    };
    } 

    let recipients = [user.email,'team@stoxhero.com'];
    let recipientString = recipients.join(",");
    let subject = "Subscription Renew - StoxHero";
    let message = 
    `
    <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Subscription Renewed</title>
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
            <h1>Subscription Renewed</h1>
            <p>Hello ${user.first_name},</p>
            <p>Thanks for renewing your subscription! Please find your renewal details below.</p>
            <p>User ID: <span class="userid">${user.employeeid}</span></p>
            <p>Full Name: <span class="password">${user.first_name} ${user.last_name}</span></p>
            <p>Email: <span class="password">${user.email}</span></p>
            <p>Mobile: <span class="password">${user.mobile}</span></p>
            <p>Subscription Name: <span class="password">${subscription.plan_name}</span></p>
            <p>Subscription Actual Price: <span class="password">₹${subscription.actual_price}/-</span></p>
            <p>Subscription Discounted Price: <span class="password">₹${subscriptionAmount}/-</span></p>  
            </div>
        </body>
        </html>

    `
    if(process.env.PROD === "true"){
      emailService(recipientString,subject,message);
      console.log("Subscription Email Sent")
    }
    if(coupon && cashbackAmount>0){
      await createUserNotification({
          title:'StoxHero Cashback',
          description:`${cashbackAmount?.toFixed(2)}HeroCash added as bonus - ${coupon} code used.`,
          notificationType:'Individual',
          notificationCategory:'Informational',
          productCategory:'TenX',
          user: user?._id,
          priority:'Medium',
          channels:['App', 'Email'],
          createdBy:'63ecbc570302e7cf0153370c',
          lastModifiedBy:'63ecbc570302e7cf0153370c'  
        });
  }
    await createUserNotification({
      title:'TenX Subscription Renewed',
      description:`₹${subscriptionAmount} deducted for renewal of TenX plan ${subscription.plan_name}`,
      notificationType:'Individual',
      notificationCategory:'Informational',
      productCategory:'TenX',
      user: user?._id,
      priority:'Medium',
      channels:['App', 'Email'],
      createdBy:'63ecbc570302e7cf0153370c',
      lastModifiedBy:'63ecbc570302e7cf0153370c'  
    }, session);
    await session.commitTransaction();
    if(coupon){
      const product = await Product.findOne({productName:'TenX'}).select('_id');
      await saveSuccessfulCouponUse(userId, coupon, product?._id, subscription?._id);
      if(affiliate){
        await creditAffiliateAmount(affiliate, affiliateProgram, product?._id, subscription?._id, subscription?.discounted_price, userId);
    }
    }
    return {
      statusCode:201,
      data:{
        status: "success",
        message: "Subscription renewed successfully."
      }
  };       
}catch(e){
    console.log(e);
    await session.abortTransaction();
    return {
      statusCode:500,
      data:{
        status: "error",
        message: "Something went wrong"
      }
  };
  }finally{
    await session.endSession();
  }

}

exports.myActiveSubsciption = async(req, res, next)=>{
  const userId = req.user._id;
  try{
      const userData = await User.findOne({_id: new ObjectId(userId)})
      let mySubs = [];
      for(let elem of userData.subscription){
        if(elem.status === "Live"){
          mySubs.push(elem.subscriptionId);
        }
      }
      const tenXSubs = await TenXSubscription.find({_id: {$in: mySubs}})
      .select("_id plan_name actual_price discounted_price profitCap validity validityPeriod status portfolio features allowPurchase allowRenewal expiryDays payoutPercentage")
      .populate('portfolio', 'portfolioName portfolioValue')
      .sort({discounted_price: 1})  
      res.status(201).json({status: 'success', data: tenXSubs});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};

exports.myActiveSubs = async(req, res, next)=>{
  const userId = req.user._id;
  try{
    const tenXSubs = await TenXSubscription.aggregate(
      [
        {
          $unwind: {
            path: "$users",
          },
        },
        {
          $lookup: {
            from: "user-portfolios",
            localField: "portfolio",
            foreignField: "_id",
            as: "portfolio_details",
          },
        },
        {
          $project: {
            _id: 1,
            plan_name: 1,
            expiryDays:1,
            features: 1,
            discounted_price:1,
            payoutPercentage: 1,
            portfolioValue: {
              $arrayElemAt: [
                "$portfolio_details.portfolioValue",
                0,
              ],
            },
            user: "$users.userId",
            fee: "$users.fee",
            status: "$users.status",
            subscribedOn: "$users.subscribedOn",
            allowRenewal:1
          },
        },
        {
          $match: {
            user: new ObjectId(userId),
            status: "Live",
          },
        },
        {
          $sort: {
            subscribedOn: -1,
          },
        },
      ]
    )
      res.status(201).json({status: 'success', data: tenXSubs});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};

exports.SubsUserCount = async(req, res, next)=>{
  const id = req.params.id ? req.params.id : '';
  try{
    const userCount = await TenXSubscription.aggregate(
      [
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $project: {
            count: {
              $size: "$users",
            },
          },
        },
      ]
    )
      res.status(201).json({status: 'success', data: userCount});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};

exports.myExpiredSubsciption = async(req, res, next)=>{
  const userId = req.user._id;
  try{
      const tenXSubs = await TenXSubscription.aggregate(
        [
          {
            $unwind: {
              path: "$users",
            },
          },
          {
            $lookup: {
              from: "user-portfolios",
              localField: "portfolio",
              foreignField: "_id",
              as: "portfolio_details",
            },
          },
          {
            $project: {
              _id: 1,
              plan_name: 1,
              expiryDays:1,
              payoutPercentage:1,
              features: 1,
              portfolioValue: {
                $arrayElemAt: [
                  "$portfolio_details.portfolioValue",
                  0,
                ],
              },
              user: "$users.userId",
              fee: "$users.fee",
              status: "$users.status",
              subscribedOn: "$users.subscribedOn",
              expiredOn: "$users.expiredOn",
            },
          },
          {
            $match: {
              user: new ObjectId(userId),
              status: "Expired",
            },
          },
          {
            $sort: {
              subscribedOn: -1,
            },
          },
        ]
      )
      res.status(201).json({status: 'success', data: tenXSubs});    
  }catch(e){
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};

exports.TenXLeaderboard = async(req, res, next)=>{
  
  try{
    const tenxleaderboard = await TenXSubscription.aggregate(
      [
        {
          $unwind: {
            path: "$users",
          },
        },
        {
          $match: {
            "users.status": "Expired",
          },
        },
        {
          $group: {
            _id: "$users.userId",
            earnings: {
              $sum: "$users.payout",
            },
            subscriptions: {
              $sum: 1,
            },
            subscriptionsWithPayout: {
              $sum: {
                $cond: {
                  if: {
                    $gt: ["$users.payout", 0],
                  },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
        },
        {
          $lookup: {
            from: "user-personal-details",
            localField: "_id",
            foreignField: "_id",
            as: "trader",
          },
        },
        {
          $project: {
            _id: 1,
            userId: "$users.userId",
            first_name: {
              $arrayElemAt: ["$trader.first_name", 0],
            },
            last_name: {
              $arrayElemAt: ["$trader.last_name", 0],
            },
            userid: {
              $arrayElemAt: ["$trader.employeeid", 0],
            },
            status: {
              $arrayElemAt: ["$trader.status", 0],
            },
            profilePic: {
              $arrayElemAt: [
                "$trader.profilePhoto.url",
                0,
              ],
            },
            earnings: "$earnings",
            subscriptions: "$subscriptions",
            subscriptionsWithPayout:
              "$subscriptionsWithPayout",
          },
        },
        {
          $match: {
            earnings: {
              $gt: 0,
            },
            status: 'Active'
          },
        },
        {
          $addFields: {
            strikeRate: {
              $divide :['$subscriptionsWithPayout','$subscriptions']
            }
          }
        },
        {
          $sort: {
            earnings: -1,
            strikeRate: -1,
            first_name: 1,
            last_name: 1,
          },
        },
      ]
    )
      
      res.status(201).json({status: 'success', data: tenxleaderboard});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};

exports.liveTenXSubscribers = async(req, res, next)=>{
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const subscribers = await TenXSubscription.aggregate(
    [
      {
        $unwind: {
          path: "$users",
        },
      },
      {
        $match: {
          "users.status": "Live",
        },
      },
    ]
    );
    
  try{
      const pipeline = 
        [
          {
            $unwind: {
              path: "$users",
            },
          },
          {
            $lookup: {
              from: "user-personal-details",
              localField: "users.userId",
              foreignField: "_id",
              as: "subscriber",
            },
          },
          {
            $lookup: {
              from: "user-portfolios",
              localField: "portfolio",
              foreignField: "_id",
              as: "portfolio_details",
            },
          },
          {
            $match: {
              "users.status": "Live",
            },
          },
          {
            $project: {
              _id: "$_id",
              first_name: {
                $arrayElemAt: [
                  "$subscriber.first_name",
                  0,
                ],
              },
              last_name: {
                $arrayElemAt: [
                  "$subscriber.last_name",
                  0,
                ],
              },
              email: {
                $arrayElemAt: [
                  "$subscriber.email",
                  0,
                ],
              },
              mobile: {
                $arrayElemAt: [
                  "$subscriber.mobile",
                  0,
                ],
              },
              creationProcess: {
                $arrayElemAt: [
                  "$subscriber.creationProcess",
                  0,
                ],
              },
              plan_name: "$plan_name",
              purchase_date: "$users.subscribedOn",
              purchaseValue: "$users.fee",
              plan_actual_price: "$actual_price",
              plan_discounted_price: "$discounted_price",
              portfolio: {
                $arrayElemAt: [
                  "$portfolio_details.portfolioValue",
                  0,
                ],
              },
              profitCap: "$profitCap",
              validity: "$validity",
              valodityPeriod: "$validityPeriod",
              expiryDays: "$expiryDays",
              payoutPercentage: "$payoutPercentage",
              plan_status: "$status",
            },
          },
          {
            $sort : {
              purchase_date : -1
            }
          }
          ]
      
      const tenXSubscribers = await TenXSubscription.aggregate(pipeline).skip(skip).limit(limit);
      const response = {
        status: "success",
        message: "Live TenX Subscribers Data fetched successfully",
        data: tenXSubscribers,
        count: subscribers.length,
    };
    res.status(200).json(response);
  }catch(e){
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};

exports.expiredTenXSubscribers = async(req, res, next)=>{
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const subscribers = await TenXSubscription.aggregate(
    [
      {
        $unwind: {
          path: "$users",
        },
      },
      {
        $match: {
          "users.status": "Expired",
        },
      },
    ]
    );
    
  try{
      const pipeline = 
        [
          {
            $unwind: {
              path: "$users",
            },
          },
          {
            $lookup: {
              from: "user-personal-details",
              localField: "users.userId",
              foreignField: "_id",
              as: "subscriber",
            },
          },
          {
            $lookup: {
              from: "user-portfolios",
              localField: "portfolio",
              foreignField: "_id",
              as: "portfolio_details",
            },
          },
          {
            $match: {
              "users.status": "Expired",
            },
          },
          {
            $project: {
              _id: "$_id",
              first_name: {
                $arrayElemAt: [
                  "$subscriber.first_name",
                  0,
                ],
              },
              last_name: {
                $arrayElemAt: [
                  "$subscriber.last_name",
                  0,
                ],
              },
              email: {
                $arrayElemAt: [
                  "$subscriber.email",
                  0,
                ],
              },
              mobile: {
                $arrayElemAt: [
                  "$subscriber.mobile",
                  0,
                ],
              },
              creationProcess: {
                $arrayElemAt: [
                  "$subscriber.creationProcess",
                  0,
                ],
              },
              plan_name: "$plan_name",
              purchase_date: "$users.subscribedOn",
              expiry_date: "$users.expiredOn",
              payout: {$ifNull : ["$users.payout",0]},
              purchaseValue: "$users.fee",
              plan_actual_price: "$actual_price",
              plan_discounted_price: "$discounted_price",
              portfolio: {
                $arrayElemAt: [
                  "$portfolio_details.portfolioValue",
                  0,
                ],
              },
              profitCap: "$profitCap",
              validity: "$validity",
              valodityPeriod: "$validityPeriod",
              expiryDays: "$expiryDays",
              payoutPercentage: "$payoutPercentage",
              plan_status: "$status",
            },
          },
          {
            $sort : {
              expiry_date : -1
            }
          }
          ]
      
      const tenXSubscribers = await TenXSubscription.aggregate(pipeline).skip(skip).limit(limit);
      const response = {
        status: "success",
        message: "Expired TenX Subscribers Data fetched successfully",
        data: tenXSubscribers,
        count: subscribers.length,
    };
    res.status(200).json(response);
  }catch(e){
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};

exports.downloadLiveTenXSubscribers = async(req, res, next)=>{
    
  try{
      const pipeline = 
        [
          {
            $unwind: {
              path: "$users",
            },
          },
          {
            $lookup: {
              from: "user-personal-details",
              localField: "users.userId",
              foreignField: "_id",
              as: "subscriber",
            },
          },
          {
            $lookup: {
              from: "user-portfolios",
              localField: "portfolio",
              foreignField: "_id",
              as: "portfolio_details",
            },
          },
          {
            $match: {
              "users.status": "Live",
            },
          },
          {
            $project: {
              _id: "$_id",
              first_name: {
                $arrayElemAt: [
                  "$subscriber.first_name",
                  0,
                ],
              },
              last_name: {
                $arrayElemAt: [
                  "$subscriber.last_name",
                  0,
                ],
              },
              email: {
                $arrayElemAt: [
                  "$subscriber.email",
                  0,
                ],
              },
              mobile: {
                $arrayElemAt: [
                  "$subscriber.mobile",
                  0,
                ],
              },
              creationProcess: {
                $arrayElemAt: [
                  "$subscriber.creationProcess",
                  0,
                ],
              },
              plan_name: "$plan_name",
              purchase_date: "$users.subscribedOn",
              purchaseValue: "$users.fee",
              plan_actual_price: "$actual_price",
              plan_discounted_price: "$discounted_price",
              portfolio: {
                $arrayElemAt: [
                  "$portfolio_details.portfolioValue",
                  0,
                ],
              },
              profitCap: "$profitCap",
              validity: "$validity",
              valodityPeriod: "$validityPeriod",
              expiryDays: "$expiryDays",
              payoutPercentage: "$payoutPercentage",
              plan_status: "$status",
            },
          },
          {
            $sort : {
              purchase_date : -1
            }
          }
          ]
      
      const tenXSubscribers = await TenXSubscription.aggregate(pipeline);
      const response = {
        status: "success",
        message: "Live TenX Subscribers Data downloaded successfully",
        data: tenXSubscribers,
    };
    res.status(200).json(response);
  }catch(e){
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};

exports.downloadExpiredTenXSubscribers = async(req, res, next)=>{

  const subscribers = await TenXSubscription.aggregate(
    [
      {
        $unwind: {
          path: "$users",
        },
      },
      {
        $match: {
          "users.status": "Expired",
        },
      },
    ]
    );
    
  try{
      const pipeline = 
        [
          {
            $unwind: {
              path: "$users",
            },
          },
          {
            $lookup: {
              from: "user-personal-details",
              localField: "users.userId",
              foreignField: "_id",
              as: "subscriber",
            },
          },
          {
            $lookup: {
              from: "user-portfolios",
              localField: "portfolio",
              foreignField: "_id",
              as: "portfolio_details",
            },
          },
          {
            $match: {
              "users.status": "Expired",
            },
          },
          {
            $project: {
              _id: "$_id",
              first_name: {
                $arrayElemAt: [
                  "$subscriber.first_name",
                  0,
                ],
              },
              last_name: {
                $arrayElemAt: [
                  "$subscriber.last_name",
                  0,
                ],
              },
              email: {
                $arrayElemAt: [
                  "$subscriber.email",
                  0,
                ],
              },
              mobile: {
                $arrayElemAt: [
                  "$subscriber.mobile",
                  0,
                ],
              },
              creationProcess: {
                $arrayElemAt: [
                  "$subscriber.creationProcess",
                  0,
                ],
              },
              plan_name: "$plan_name",
              purchase_date: "$users.subscribedOn",
              expiry_date: "$users.expiredOn",
              payout: {$ifNull : ["$users.payout",0]},
              purchaseValue: "$users.fee",
              plan_actual_price: "$actual_price",
              plan_discounted_price: "$discounted_price",
              portfolio: {
                $arrayElemAt: [
                  "$portfolio_details.portfolioValue",
                  0,
                ],
              },
              profitCap: "$profitCap",
              validity: "$validity",
              valodityPeriod: "$validityPeriod",
              expiryDays: "$expiryDays",
              payoutPercentage: "$payoutPercentage",
              plan_status: "$status",
            },
          },
          {
            $sort : {
              expiry_date : -1
            }
          }
          ]
      
      const tenXSubscribers = await TenXSubscription.aggregate(pipeline);
      const response = {
        status: "success",
        message: "Expired TenX Subscribers Data downloaded successfully",
        data: tenXSubscribers,
    };
    res.status(200).json(response);
  }catch(e){
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};

exports.tenXPurchaseToday = async(req, res, next)=>{
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  const subscribers = await TenXSubscription.aggregate(
    [
      {
        $unwind: {
          path: "$users",
        },
      },
      {
        $match: {
          "users.status": "Live",
          "users.subscribedOn": {$gte : today}
        },
      },
    ]
    );
    
  try{
      const pipeline = 
        [
          {
            $unwind: {
              path: "$users",
            },
          },
          {
            $lookup: {
              from: "user-personal-details",
              localField: "users.userId",
              foreignField: "_id",
              as: "subscriber",
            },
          },
          {
            $lookup: {
              from: "user-portfolios",
              localField: "portfolio",
              foreignField: "_id",
              as: "portfolio_details",
            },
          },
          {
            $match: {
              "users.status": "Live",
              "users.subscribedOn": {$gte : today}
            },
          },
          {
            $project: {
              _id: "$_id",
              first_name: {
                $arrayElemAt: [
                  "$subscriber.first_name",
                  0,
                ],
              },
              last_name: {
                $arrayElemAt: [
                  "$subscriber.last_name",
                  0,
                ],
              },
              email: {
                $arrayElemAt: [
                  "$subscriber.email",
                  0,
                ],
              },
              mobile: {
                $arrayElemAt: [
                  "$subscriber.mobile",
                  0,
                ],
              },
              creationProcess: {
                $arrayElemAt: [
                  "$subscriber.creationProcess",
                  0,
                ],
              },
              plan_name: "$plan_name",
              purchase_date: "$users.subscribedOn",
              purchaseValue: "$users.fee",
              plan_actual_price: "$actual_price",
              plan_discounted_price: "$discounted_price",
              portfolio: {
                $arrayElemAt: [
                  "$portfolio_details.portfolioValue",
                  0,
                ],
              },
              profitCap: "$profitCap",
              validity: "$validity",
              valodityPeriod: "$validityPeriod",
              expiryDays: "$expiryDays",
              payoutPercentage: "$payoutPercentage",
              plan_status: "$status",
            },
          },
          {
            $sort : {
              purchase_date : -1
            }
          }
          ]
      
      const tenXSubscribers = await TenXSubscription.aggregate(pipeline).skip(skip).limit(limit);
      const response = {
        status: "success",
        message: "TenX Subscriptions Purchased Today Data fetched successfully",
        data: tenXSubscribers,
        count: subscribers.length,
    };
    res.status(200).json(response);
  }catch(e){
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};

exports.tenXExpiredToday = async(req, res, next)=>{
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  let date = new Date();
  // date.setDate(date.getDate() - 3);
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const subscribers = await TenXSubscription.aggregate(
    [
      {
        $unwind: {
          path: "$users",
        },
      },
      {
        $match: {
          "users.status": "Expired",
          "users.expiredOn": {$gte : today}
        },
      },
    ]
    );
    
  try{
      const pipeline = 
        [
          {
            $unwind: {
              path: "$users",
            },
          },
          {
            $lookup: {
              from: "user-personal-details",
              localField: "users.userId",
              foreignField: "_id",
              as: "subscriber",
            },
          },
          {
            $lookup: {
              from: "user-portfolios",
              localField: "portfolio",
              foreignField: "_id",
              as: "portfolio_details",
            },
          },
          {
            $match: {
              "users.status": "Expired",
              "users.expiredOn": {$gte : today}
            },
          },
          {
            $project: {
              _id: "$_id",
              first_name: {
                $arrayElemAt: [
                  "$subscriber.first_name",
                  0,
                ],
              },
              last_name: {
                $arrayElemAt: [
                  "$subscriber.last_name",
                  0,
                ],
              },
              email: {
                $arrayElemAt: [
                  "$subscriber.email",
                  0,
                ],
              },
              mobile: {
                $arrayElemAt: [
                  "$subscriber.mobile",
                  0,
                ],
              },
              creationProcess: {
                $arrayElemAt: [
                  "$subscriber.creationProcess",
                  0,
                ],
              },
              plan_name: "$plan_name",
              purchase_date: "$users.subscribedOn",
              expiry_date: "$users.expiredOn",
              payout: {$ifNull : ["$users.payout",0]},
              purchaseValue: "$users.fee",
              plan_actual_price: "$actual_price",
              plan_discounted_price: "$discounted_price",
              portfolio: {
                $arrayElemAt: [
                  "$portfolio_details.portfolioValue",
                  0,
                ],
              },
              profitCap: "$profitCap",
              validity: "$validity",
              valodityPeriod: "$validityPeriod",
              expiryDays: "$expiryDays",
              payoutPercentage: "$payoutPercentage",
              plan_status: "$status",
            },
          },
          {
            $sort : {
              payout : -1
            }
          }
          ]
      
      const tenXSubscribers = await TenXSubscription.aggregate(pipeline).skip(skip).limit(limit);
      const response = {
        status: "success",
        message: "TenX Subscription Expired Today Data fetched successfully",
        data: tenXSubscribers,
        count: subscribers.length,
    };
    res.status(200).json(response);
  }catch(e){
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};

exports.tenXExpiredYesterday = async(req, res, next)=>{
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
  yesterdayDate = yesterdayDate + "T00:00:00.000Z";
  const dateyesterday = new Date(yesterdayDate)
  const subscribers = await TenXSubscription.aggregate(
    [
      {
        $unwind: {
          path: "$users",
        },
      },
      {
        $match: {
          "users.status": "Expired",
          "users.expiredOn": {$gte : dateyesterday, $lt: today}
        },
      },
    ]
    );
    
  try{
      const pipeline = 
        [
          {
            $unwind: {
              path: "$users",
            },
          },
          {
            $lookup: {
              from: "user-personal-details",
              localField: "users.userId",
              foreignField: "_id",
              as: "subscriber",
            },
          },
          {
            $lookup: {
              from: "user-portfolios",
              localField: "portfolio",
              foreignField: "_id",
              as: "portfolio_details",
            },
          },
          {
            $match: {
              "users.status": "Expired",
              "users.expiredOn": {$gte : dateyesterday, $lt: today}
            },
          },
          {
            $project: {
              _id: "$_id",
              first_name: {
                $arrayElemAt: [
                  "$subscriber.first_name",
                  0,
                ],
              },
              last_name: {
                $arrayElemAt: [
                  "$subscriber.last_name",
                  0,
                ],
              },
              email: {
                $arrayElemAt: [
                  "$subscriber.email",
                  0,
                ],
              },
              mobile: {
                $arrayElemAt: [
                  "$subscriber.mobile",
                  0,
                ],
              },
              creationProcess: {
                $arrayElemAt: [
                  "$subscriber.creationProcess",
                  0,
                ],
              },
              plan_name: "$plan_name",
              purchase_date: "$users.subscribedOn",
              expiry_date: "$users.expiredOn",
              payout: {$ifNull : ["$users.payout",0]},
              purchaseValue: "$users.fee",
              plan_actual_price: "$actual_price",
              plan_discounted_price: "$discounted_price",
              portfolio: {
                $arrayElemAt: [
                  "$portfolio_details.portfolioValue",
                  0,
                ],
              },
              profitCap: "$profitCap",
              validity: "$validity",
              valodityPeriod: "$validityPeriod",
              expiryDays: "$expiryDays",
              payoutPercentage: "$payoutPercentage",
              plan_status: "$status",
            },
          },
          {
            $sort : {
              payout : -1
            }
          }
          ]
      
      const tenXSubscribers = await TenXSubscription.aggregate(pipeline).skip(skip).limit(limit);
      const response = {
        status: "success",
        message: "TenX Subscription Expired Yesterday Data fetched successfully",
        data: tenXSubscribers,
        count: subscribers.length,
    };
    res.status(200).json(response);
  }catch(e){
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};

exports.tenXPurchaseYesterday = async(req, res, next)=>{
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
  yesterdayDate = yesterdayDate + "T00:00:00.000Z";
  const dateyesterday = new Date(yesterdayDate)

  const subscribers = await TenXSubscription.aggregate(
    [
      {
        $unwind: {
          path: "$users",
        },
      },
      {
        $match: {
          "users.status": "Live",
          "users.subscribedOn": {$gte : dateyesterday, $lt: today}
        },
      },
    ]
    );
    
  try{
      const pipeline = 
        [
          {
            $unwind: {
              path: "$users",
            },
          },
          {
            $lookup: {
              from: "user-personal-details",
              localField: "users.userId",
              foreignField: "_id",
              as: "subscriber",
            },
          },
          {
            $lookup: {
              from: "user-portfolios",
              localField: "portfolio",
              foreignField: "_id",
              as: "portfolio_details",
            },
          },
          {
            $match: {
              "users.status": "Live",
              "users.subscribedOn": {$gte : dateyesterday, $lt: today}
            },
          },
          {
            $project: {
              _id: "$_id",
              first_name: {
                $arrayElemAt: [
                  "$subscriber.first_name",
                  0,
                ],
              },
              last_name: {
                $arrayElemAt: [
                  "$subscriber.last_name",
                  0,
                ],
              },
              email: {
                $arrayElemAt: [
                  "$subscriber.email",
                  0,
                ],
              },
              mobile: {
                $arrayElemAt: [
                  "$subscriber.mobile",
                  0,
                ],
              },
              creationProcess: {
                $arrayElemAt: [
                  "$subscriber.creationProcess",
                  0,
                ],
              },
              plan_name: "$plan_name",
              purchase_date: "$users.subscribedOn",
              purchaseValue: "$users.fee",
              plan_actual_price: "$actual_price",
              plan_discounted_price: "$discounted_price",
              portfolio: {
                $arrayElemAt: [
                  "$portfolio_details.portfolioValue",
                  0,
                ],
              },
              profitCap: "$profitCap",
              validity: "$validity",
              valodityPeriod: "$validityPeriod",
              expiryDays: "$expiryDays",
              payoutPercentage: "$payoutPercentage",
              plan_status: "$status",
            },
          },
          {
            $sort : {
              purchase_date : -1
            }
          }
          ]
      
      const tenXSubscribers = await TenXSubscription.aggregate(pipeline).skip(skip).limit(limit);
      const response = {
        status: "success",
        message: "TenX Subscriptions Purchased Today Data fetched successfully",
        data: tenXSubscribers,
        count: subscribers.length,
    };
    res.status(200).json(response);
  }catch(e){
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};