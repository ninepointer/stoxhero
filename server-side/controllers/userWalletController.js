const UserWallet = require('../models/UserWallet/userWalletSchema');
const User = require('../models/User/userDetailSchema');
const Subscription = require("../models/TenXSubscription/TenXSubscriptionSchema")
const ObjectId = require('mongodb').ObjectId;
const uuid = require('uuid');



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
    const userId = req.user._id;
    const {subscriptionAmount, subscriptionName, subscribedId} = req.body
    console.log("all three", subscriptionAmount, subscriptionName, subscribedId)
    try{

        const wallet = await UserWallet.findOne({userId: userId});
        wallet.transactions = [...wallet.transactions, {
              title: 'Subscription Deduct',
              description: `Amount deducted for subscription ${subscriptionName} purchase`,
              amount: (-subscriptionAmount),
              transactionId: uuid.v4(),
              transactionType: 'Cash'
        }];
        wallet.save();

        // const user = await User.findOne({_id: userId});
        // user.subscription = [...user.subscription, {
        //     subscriptionId: subscribedId,
        //     subscribedOn: new Date()
        // }];
        // console.log("user", user.subscription)
        // user.save();

        const user = await User.findOneAndUpdate(
            { _id: userId },
            {
              $push: {
                subscription: {
                  subscriptionId: subscribedId,
                  subscribedOn: new Date()
                }
              }
            },
            { new: true }
          );

          const subscription = await Subscription.findOneAndUpdate(
            { _id: subscribedId },
            {
              $push: {
                users: {
                    userId: userId,
                    subscribedOn: new Date()
                }
              }
            },
            { new: true }
          );

        // const subscription = await Subscription.findOne({_id: subscribedId});
        console.log("subscription1" ,subscription.users)
        // subscription.users = [...subscription.users, {
        //   userId: userId,
        //   subscribedOn: new Date()
        // }];
        // console.log("subscription" ,subscription.users)
        // subscription.save();

        if(!wallet){
            return res.status(404).json({status:'error', message: 'No Wallet found'});
        }

        res.status(200).json({status: 'success', message: "Subscription purchased successfully", data: wallet});

    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
}


