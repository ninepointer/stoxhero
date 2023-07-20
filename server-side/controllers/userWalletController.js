const UserWallet = require('../models/UserWallet/userWalletSchema');
const emailService = require("../utils/emailService")
const User = require('../models/User/userDetailSchema');
const Subscription = require("../models/TenXSubscription/TenXSubscriptionSchema")
const ObjectId = require('mongodb').ObjectId;
const uuid = require('uuid');
const {client, getValue} = require("../marketData/redisClient");



exports.createUserWallet = async(req, res, next)=>{
    console.log(req.body)
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

exports.myWallet = async(req,res,next) => {
    const userId = req.user._id;
    try{
        const myWallet = await UserWallet.findOne({"userId": userId})
        .populate('userId', { first_name: 1, last_name: 1, profilePhoto: 1 });

        if(!myWallet){
            return res.status(404).json({status:'error', message: 'No Wallet found'});
        }
        
        res.status(200).json({status: 'success', data: myWallet});

    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
}

exports.deductSubscriptionAmount = async(req,res,next) => {
    let isRedisConnected = getValue();
    const userId = req.user._id;
    const {subscriptionAmount, subscriptionName, subscribedId} = req.body
    console.log("all three", subscriptionAmount, subscriptionName, subscribedId)
    try{

        const subs = await Subscription.findOne({_id: new ObjectId(subscribedId)});

        for(let i = 0; i < subs.users.length; i++){
            if(subs.users[i].userId.toString() == userId.toString() && subs.users[i].status == "Live"){
                console.log("getting that user")
                return res.status(404).json({status:'error', message: 'You already have subscribed this subscription'});
                // break;
            }
        }

        console.log("outside of for loop")

        const wallet = await UserWallet.findOne({userId: userId});
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
                  subscriptionId: new ObjectId(subscribedId),
                  subscribedOn: new Date()
                }
              }
            },
            { new: true }
        );

        const subscription = await Subscription.findOneAndUpdate(
        { _id: new ObjectId(subscribedId) },
        {
            $push: {
            users: {
                userId: new ObjectId(userId),
                subscribedOn: new Date()
            }
            }
        },
        { new: true }
        );

        if(isRedisConnected){
            await client.del(`${user._id.toString()}authenticatedUser`);
        }

        if(!wallet){
            return res.status(404).json({status:'error', message: 'No Wallet found'});
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
                    <p>Subscription Discounted Price: <span class="password">₹${subscription.discounted_price}/-</span></p>  
                    </div>
                </body>
                </html>

            `
            emailService(recipientString,subject,message);
            console.log("Subscription Email Sent")

        res.status(200).json({status: 'success', message: "Subscription purchased successfully", data: user});

    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
}

