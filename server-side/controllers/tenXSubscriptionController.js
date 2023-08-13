const TenXSubscription = require("../models/TenXSubscription/TenXSubscriptionSchema");
const TenXPurchaseIntent = require("../models/TenXSubscription/TenXPurchaseIntentSchema");
const { ObjectId } = require("mongodb");
const TenXTrader = require("../models/mock-trade/tenXTraderSchema");
const User = require("../models/User/userDetailSchema");
const Wallet = require("../models/UserWallet/userWalletSchema");
const uuid = require('uuid');
const {client, getValue} = require("../marketData/redisClient");
const emailService = require("../utils/emailService")


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
    console.log(req.body)
    const{
        plan_name, actual_price, discounted_price, features, validity, validityPeriod,
        status, portfolio, profitCap, allowPurchase, allowRenewal } = req.body;
    if(await TenXSubscription.findOne({plan_name, status: "Active" })) return res.status(400).json({message:'This subscription already exists.'});

    const tenXSubs = await TenXSubscription.create({plan_name:plan_name.trim(), actual_price, discounted_price, features, validity, validityPeriod,
        status, createdBy: req.user._id, lastModifiedBy: req.user._id, portfolio, profitCap, allowPurchase, allowRenewal});
    
    res.status(201).json({message: 'TenX Subscription successfully created.', data:tenXSubs});
}

exports.editTanx = async(req, res, next) => {
    const id = req.params.id;

    // console.log("id is ,", id)
    const tenx = await TenXSubscription.findById(id);

    const filteredBody = filterObj(req.body, "plan_name", "actual_price", "discounted_price", "validity", "validityPeriod", 
        "status", "profitCap", "portfolio", "allowPurchase", "allowRenewal");
    if(req.body.features)filteredBody.features=[...tenx.features,
        {orderNo:req.body.features.orderNo,
            description:req.body.features.description,}]
    filteredBody.lastModifiedBy = req.user._id;    

    console.log(filteredBody)
    const updated = await TenXSubscription.findByIdAndUpdate(id, filteredBody, { new: true });

    res.status(200).json({message: 'Successfully edited tenx.', data: updated});
}

exports.editFeature = async(req, res, next) => {
    const id = req.params.id;
    const {orderNo, description} = req.body;

    console.log("id is ,", id)
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

    console.log("id is ,", id)
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
        const tenXSubs = await TenXSubscription.find({status: "Active", allowPurchase: true}).select('actual_price discounted_price plan_name portfolio profitCap status validity validityPeriod features')
        .populate('portfolio', 'portfolioName portfolioValue')
        .sort({$natural: 1})
        
        res.status(201).json({status: 'success', data: tenXSubs, results: tenXSubs.length});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }     
};

exports.getAdminActiveTenXSubs = async(req, res, next)=>{
  try{
      const tenXSubs = await TenXSubscription.find({status: "Active"}).select('actual_price discounted_price plan_name portfolio profitCap status validity validityPeriod features')
      .populate('portfolio', 'portfolioName portfolioValue')
      .sort({$natural: 1})
      
      res.status(201).json({status: 'success', data: tenXSubs, results: tenXSubs.length});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};

exports.getInactiveTenXSubs = async(req, res, next)=>{
  try{
      const tenXSubs = await TenXSubscription.find({status: "Inactive"})
      .populate('portfolio', 'portfolioName portfolioValue')
      
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
    .populate('users.userId','first_name last_name mobile email');

    res.status(201).json({message: "TenXSubscription Retrived",data: tenXSubscription});    
    }
    catch{(err)=>{res.status(401).json({message: "New TenXSubscription", error:err}); }}  
};

exports.createTenXPurchaseIntent = async(req, res, next)=>{
  console.log(req.body)
  try{
  const{ purchase_intent_by, tenXSubscription } = req.body;

  const tenXPurchaseIntent = await TenXPurchaseIntent.create({purchase_intent_by, tenXSubscription});
  console.log(tenXPurchaseIntent)
  res.status(201).json({message: 'TenX Purchase Intent Captured Successfully.', data:tenXPurchaseIntent});
  }
  catch{(err)=>{res.status(401).json({message: "Something went wrong", error:err}); }}  
}

exports.getTenXSubscriptionPurchaseIntent = async(req, res, next)=>{
  const id = req.params.id ? req.params.id : '';
  try{
      const purchaseIntent = await TenXPurchaseIntent.find({tenXSubscription : id})
      .populate('purchase_intent_by', 'first_name last_name mobile email joining_date')

      res.status(201).json({status: 'success', data: purchaseIntent, count: purchaseIntent.length});    
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
  const {subscriptionAmount, subscriptionName, subscriptionId} = req.body
  const today = new Date();
  try{
      const tenXSubs = await TenXSubscription.findOne({_id: new ObjectId(subscriptionId)})

      if(!tenXSubs.allowRenewal){
        return res.status(404).json({status:'error', message: 'This subscription is no longer available for purchase or renewal. Please purchase a different plan.'});
      }
      const users = tenXSubs.users;
      const Subslen = tenXSubs.users.length;
      for (let j = 0; j < users.length; j++) {
        if(users[j].userId.toString() === userId.toString()){
          const status = users[j].status;
          const subscribedOn = users[j].subscribedOn;

          if(status === "Live"){
            console.log(new Date(subscribedOn))
  
            const user = await User.findOne({ _id: new ObjectId(userId) });
            let len = user.subscription.length;
            
            for (let k = len - 1; k >= 0; k--) {
              if (user.subscription[k].subscriptionId?.toString() === tenXSubs._id?.toString()) {
                user.subscription[k].status = "Expired";
                user.subscription[k].expiredOn = new Date();
                user.subscription[k].expiredBy = "User";
                console.log("this is user", user)
                await user.save();
                break;
              }
            }
            
            for (let k = Subslen - 1; k >= 0; k--) {
              if (tenXSubs.users[k].userId?.toString() === userId?.toString()) {
                tenXSubs.users[k].status = "Expired";
                tenXSubs.users[k].expiredOn = new Date();
                tenXSubs.users[k].expiredBy = "User";
                console.log("this is tenXSubs", tenXSubs)
                await tenXSubs.save();
                break;
              }
            }
          }
        }
      }

      console.log("all three", subscriptionAmount, subscriptionName, subscriptionId)
        
      for(let i = 0; i < tenXSubs.users.length; i++){
          if(tenXSubs.users[i].userId.toString() == userId.toString() && tenXSubs.users[i].status == "Live"){
              console.log("getting that user")
              return res.status(404).json({status:'error', message: 'Something went wrong.'});
          }
      }

      console.log("outside of for loop")

      const wallet = await Wallet.findOne({userId: userId});
      wallet.transactions = [...wallet.transactions, {
            title: 'Bought TenX Trading Subscription',
            description: `Amount deducted for the purchase of ${subscriptionName} subscription`,
            amount: (-subscriptionAmount),
            transactionId: uuid.v4(),
            transactionType: 'Cash'
      }];
      wallet.save();

      const user = await User.findOneAndUpdate(
          { _id: userId },
          {
            $push: {
              subscription: {
                subscriptionId: new ObjectId(subscriptionId),
                subscribedOn: new Date(),
                isRenew: true,
                fee: subscriptionAmount
              }
            }
          },
          { new: true }
      );

      const subscription = await TenXSubscription.findOneAndUpdate(
      { _id: new ObjectId(subscriptionId) },
      {
          $push: {
            users: {
                userId: new ObjectId(userId),
                subscribedOn: new Date(),
                isRenew: true,
                fee: subscriptionAmount
            }
          }
      },
      { new: true }
      );

      if(isRedisConnected){
        await client.del(`${user._id.toString()}authenticatedUser`);
        await client.del(`${userId.toString()}${subscriptionId.toString()} openingBalanceAndMarginTenx`)
        await client.del(`${userId.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)
      }

      if(!wallet){
        return res.status(404).json({status:'error', message: 'Something went wrong.'});
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
              <p>Subscription Discounted Price: <span class="password">₹${subscription.discounted_price}/-</span></p>  
              </div>
          </body>
          </html>

      `
      if(process.env.PROD === "true"){
        emailService(recipientString,subject,message);
        console.log("Subscription Email Sent")
      }
      
      res.status(201).json({status: 'success', message: 'Subscription renewed successfully.'});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};

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
      .select("_id plan_name actual_price discounted_price profitCap validity validityPeriod status portfolio features").populate('portfolio', 'portfolioName portfolioValue')      
      res.status(201).json({status: 'success', data: tenXSubs});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};