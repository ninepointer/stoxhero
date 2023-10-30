const UserWallet = require('../models/UserWallet/userWalletSchema');
const emailService = require("../utils/emailService")
const User = require('../models/User/userDetailSchema');
const Subscription = require("../models/TenXSubscription/TenXSubscriptionSchema")
const ObjectId = require('mongodb').ObjectId;
const uuid = require('uuid');
const {client, getValue} = require("../marketData/redisClient");
const mongoose = require('mongoose');
const {createUserNotification} = require('./notification/notificationController');
const Product = require('../models/Product/product');
const {saveSuccessfulCouponUse} = require('./coupon/couponController');
const Setting = require('../models/settings/setting');
const Coupon = require('../models/coupon/coupon');
const {creditAffiliateAmount}= require('./affiliateProgramme/affiliateController');
const AffiliateProgram = require('../models/affiliateProgram/affiliateProgram');


exports.createUserWallet = async(req, res, next)=>{
    // console.log(req.body)
    const{userId} = req.body;
    if(await UserWallet.findOne({userId})) return res.status(400).json({message:'The user already have a wallet.'});

    const wallet = await UserWallet.create({userId, createdBy: userId});
    
    res.status(201).json({message: 'User Wallet successfully created.', data:wallet});   
}

exports.getUserWallets = async(req, res, next)=>{
    try{
        const wallet = await UserWallet.find()
        
        res.status(201).json({status: 'success', data: wallet, results: wallet.length});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
        
};

exports.getUserWallet = async(req, res, next)=>{
    
    const id = req.params.id ? req.params.id : '';
    try{
    const wallet = await UserWallet.findById(id) 

    res.status(201).json({message: "User Wallet Retrived",data: wallet});    
    }
    catch{(err)=>{res.status(401).json({message: "Something went wrong", error:err}); }}  
};

// exports.myWallet = async(req,res,next) => {
//     const userId = req.user._id;
//     try{
//         const myWallet = await UserWallet.findOne({"userId": userId})
//         .populate('userId', { first_name: 1, last_name: 1, profilePhoto: 1 }).sort({transactions});

//         if(!myWallet){
//             return res.status(404).json({status:'error', message: 'No Wallet found'});
//         }
        
//         res.status(200).json({status: 'success', data: myWallet});

//     }catch(e){
//         console.log(e);
//         res.status(500).json({status: 'error', message: 'Something went wrong'});
//     }
// }
exports.myWallet = async (req, res, next) => {
    const userId = req.user._id;
    try {
        // Using aggregation
        const wallets = await UserWallet.aggregate([
            // Matching user
            { $match: { "userId": mongoose.Types.ObjectId(userId) } },

            // Unwinding the transactions to sort them
            { $unwind: "$transactions" },

            // Sorting transactions by transactionDate in descending order
            { $sort: { "transactions.transactionDate": -1 } },

            // Grouping back to original document structure
            {
                $group: {
                    _id: "$_id",
                    userId: { $first: "$userId" },
                    transactions: { $push: "$transactions" },
                    createdOn: { $first: "$createdOn" },
                    createdBy: { $first: "$createdBy" }
                }
            }
        ]);

        if (wallets.length === 0) {
            return res.status(404).json({ status: 'error', message: 'No Wallet found' });
        }

        // Since aggregation doesn't allow direct use of populate, using it separately
        const myWallet = await UserWallet.populate(wallets[0], {
            path: 'userId',
            select: 'first_name last_name profilePhoto KYCStatus'
        });

        res.status(200).json({ status: 'success', data: myWallet });

    } catch (e) {
        console.log(e);
        res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
};


exports.deductSubscriptionAmount = async(req,res,next) => {
    const userId = req.user._id;
    let {subscriptionAmount, subscriptionName, subscribedId, coupon, bonusRedemption} = req.body

    try {
        const result = await exports.handleDeductSubscriptionAmount(userId, subscriptionAmount, subscriptionName, subscribedId, coupon, bonusRedemption);
        res.status(result.statusCode).json(result.data);
        console.log(result, result.statusCode, result.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong...'
        });
    }
}

exports.handleDeductSubscriptionAmount = async(userId, subscriptionAmount, subscriptionName, subscribedId, coupon, bonusRedemption) => {
    let isRedisConnected = getValue();
    // console.log("all three", subscriptionAmount, subscriptionName, subscribedId)
    const session = await mongoose.startSession();
    let result = {};
    try{
        let affiliate, affiliateProgram;
        let discountAmount = 0;
        let cashbackAmount = 0;
        session.startTransaction();
        const subs = await Subscription.findOne({_id: new ObjectId(subscribedId)});
        const setting = await Setting.find({});
        if(!subscriptionAmount){
            subscriptionAmount = subs?.discounted_price;
        }
        const wallet = await UserWallet.findOne({userId: userId});
        let amount = 0;
        let bonusAmount = 0;
        for(elem of wallet.transactions){
          if(elem?.transactionType == 'Cash'){
            amount += elem.amount;
          }else if(elem?.transactionType == 'Bonus'){
            bonusAmount += elem.amount;  
          }  
        }

        if(bonusRedemption > bonusAmount || bonusRedemption > subs?.discounted_price*setting[0]?.maxBonusRedemptionPercentage){
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
            let couponDoc = await Coupon.findOne({code:coupon});
            if(!couponDoc){
                const affiliatePrograms = await AffiliateProgram.find({status:'Active'});
                if(affiliatePrograms.length != 0)
                    for(let program of affiliatePrograms){
                        let match = program?.affiliates?.find(item => item?.affiliateCode?.toString() == coupon?.toString());
                        if(match){
                            affiliate = match;
                            affiliateProgram = program;
                            couponDoc = {rewardType: 'Discount', discountType:'Percentage', discount: program?.discountPercentage, maxDiscount:program?.maxDiscount }
                        }
                    }

            }
            if(couponDoc?.rewardType == 'Discount'){
                if(couponDoc?.discountType == 'Flat'){
                    //Calculate amount and match
                    discountAmount = couponDoc?.discount;
                }else{
                    discountAmount = Math.min(couponDoc?.discount/100*subs?.discounted_price, couponDoc?.maxDiscount);
                    
                }
            }else{
                if(couponDoc?.discountType == 'Flat'){
                    //Calculate amount and match
                    cashbackAmount = couponDoc?.discount;
                }else{
                    cashbackAmount = Math.min(couponDoc?.discount/100*(subs?.discounted_price-bonusRedemption), couponDoc?.maxDiscount);
                    
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
        const totalAmount = (subs?.discounted_price - discountAmount - bonusRedemption)*(1+setting[0]?.gstPercentage/100)
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
                message:"You do not have sufficient funds to purchase this subscription. Please add money to your wallet.",
                }
            };  
        }
        if(!subs.allowPurchase){
            return {
                statusCode:400,
                data:{
                status: "error",
                message:"This subscription is no longer available for purchase or renewal. Please purchase a different plan.",
                }
            };  
        }

        for(let i = 0; i < subs.users.length; i++){
            if(subs.users[i].userId.toString() == userId.toString() && subs.users[i].status == "Live"){
                // console.log("getting that user")
                return {
                    statusCode:400,
                    data:{
                    status: "error",
                    message:"You already have subscribed this subscription",
                    }
                };
                // break;
            }
        }

        // console.log("outside of for loop")

        // const wallet = await UserWallet.findOne({userId: userId});
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
                  subscriptionId: new ObjectId(subscribedId),
                  subscribedOn: new Date(),
                  fee: subscriptionAmount,
                  bonusRedemption:bonusRedemption??0,
                  actualPrice:subs?.discounted_price,
                }
              }
            },
            { new: true, session: session}
        );

        const subscription = await Subscription.findOneAndUpdate(
        { _id: new ObjectId(subscribedId) },
        {
            $push: {
                users: {
                    userId: new ObjectId(userId),
                    subscribedOn: new Date(),
                    fee: subscriptionAmount,
                    actualPrice:subs?.discounted_price,
                    bonusRedemption:bonusRedemption??0,
                }
            }
        },
        { new: true, session: session }
        );

        if(isRedisConnected){
            await client.del(`${user._id.toString()}authenticatedUser`);
        }

        if(!wallet){
            return {
                statusCode:404,
                data:{
                status: "error",
                message:"No Wallet found",
                }
            };
        } 
        let recipients = [user.email,'team@stoxhero.com'];
        let recipientString = recipients.join(",");
        let subject = "New Subscription - StoxHero";
        let message = 
        `
        <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>New Subscription Purchased</title>
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
                <h1>New Subscription Purchased</h1>
                <p>Hello ${user.first_name},</p>
                <p>Thanks for purchasing our subscription! Please find your purchase details below.</p>
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
                description:`${cashbackAmount?.toFixed(2)} HeroCash added as bonus - ${coupon} code used.`,
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
            title:'TenX Subscription Deducted',
            description:`₹${subscriptionAmount} deducted for your TenX plan ${subscription.plan_name} subscription`,
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
            if(affiliate){
                await creditAffiliateAmount(affiliate, affiliateProgram, product?._id, subs?._id, subs?.discounted_price, userId);
            }else{
                await saveSuccessfulCouponUse(userId, coupon, product?._id, subscription?._id);
            }
          }
          result = {
            statusCode:200,
            data:{
                status: 'success',
                message: "Subscription purchased successfully",
                data: user
            }
        };
    }catch(e){
        console.log(e);
        result = {
            statusCode:500,
            data:{
                status: 'error',
                message: 'Something went wrong'
            }
        };
        await session.abortTransaction();
    }finally{
        session.endSession();
        return result;
    }
}

