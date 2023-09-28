const Withdrawal = require('../models/withdrawal/withdrawal');
const User = require('../models/User/userDetailSchema');
const Wallet = require('../models/UserWallet/userWalletSchema');
const uuid = require('uuid');
const sendMail = require('../utils/emailService');
const Settings = require('../models/settings/setting');
const mongoose = require('mongoose');
const {createUserNotification} = require('../controllers/notification/notificationController');

const multer = require('multer');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
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
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


exports.uploadMulter = upload;

exports.resizePhoto = (req, res, next) => {
    if (!req.file) {
      // no file uploaded, skip to next middleware
      next();
      return;
    }
    sharp(req.file.buffer).resize({width: 500, height: 500}).toBuffer()
    .then((resizedImageBuffer) => {
      req.file.buffer = resizedImageBuffer;
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
        (req).uploadUrl = s3Data.Location;
        next();
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Error uploading to S3" });
      });
  };



exports.createWithdrawal = async(req,res,next) => {
    const userId = req.user._id;
    const{amount}=req.body
    const user = await User.findById(userId).select('KYCStatus');
    if(!user.KYCStatus || user?.KYCStatus!='Approved'){
        return res.status(400).json({status:'error', message:'KYC not completed. Complete KYC and try again.'})
    }
    if(!amount){
        return res.status(200).json({status:'error', message:'Enter a valid amount'});
    }
    const tomorrowDate = new Date();
    tomorrowDate.setHours(18, 29, 59, 0);

    const currentDate = new Date();
    const currentDateTime = new Date(currentDate.setDate(currentDate.getDate() - 1));
    currentDateTime.setHours(18, 30, 00, 0);

    const withdrawals = await Withdrawal.find({
    user: user?._id,
    $and: [
        { withdrawalRequestDate: { $lte: tomorrowDate } },
        { withdrawalRequestDate: { $gte: currentDate } }
    ]
    });

    if (withdrawals.length > 0) {
        return res.status(400).json({status:'error', message:'Only one withdrawal can be made in a day. Try again tomorrow.'})
    }
    const appSettings = await Settings.findOne({});
    const userWallet = await Wallet.findOne({userId});
    // const walletBalance = userWallet?.transactions.reduce((acc, obj) => (acc + obj.amount), 0);
    const walletBalance = userWallet?.transactions
    .filter(transaction => transaction.transactionType === 'Cash')
    .reduce((acc, obj) => acc + obj.amount, 0);
    if(amount>walletBalance){
        return res.status(400).json({status:'error', message:'You don\'t have enough funds for the withdrawal.'});
    }

    if(amount<appSettings.minWithdrawal){
        return res.status(400).json({status:'error', message:`The minimum amount that can be withdrawn is ₹${appSettings.minWithdrawal}`});
    }
    if(walletBalance > appSettings?.walletbalanceUpperLimit){
        if(amount>appSettings?.maxWithdrawalHigh){
            return res.status(400).json({status:'error', message:`The maximum amount that can be withdrawn is ₹${appSettings?.maxWithdrawalHigh}`});
        }
    }else{
        if(amount>appSettings.maxWithdrawal){
            return res.status(400).json({status:'error', message:`The maximum amount that can be withdrawn is ₹${appSettings.maxWithdrawal}`});
        }
    }
    const transactionId = uuid.v4();
    let withdrawalCount = await Withdrawal.countDocuments({user:userId});
    await Withdrawal.create({
        amount, user:userId, userWallet:userWallet?._id, withdrawalStatus:'Pending', 
        createdBy:userId, lastModifiedBy:userId, walletTransactionId:transactionId, actions:[{
            actionDate: Date.now(),
            actionTitle:`Withdrawal Request for ₹${amount}`,
            actionStatus:'Open',
            actionBy:user._id
        }]
    });

    userWallet.transactions.push({
        title:`Withdraw`, 
        description:`User initiated withdrawal from wallet of ₹${amount} to bank account - Withdrawal #${withdrawalCount+1}`,
        amount: -amount,
        transactionId,
        transactionType: 'Cash',
        transactionStatus:'Pending'
    });
    await userWallet.save({validateBeforeSave:false});
    res.status(201).json({status:'success', message:'Withdrawal request successful'});
}

exports.getAllWithdrwals = async (req, res, next) => {
    try{
        const withdrawals = await Withdrawal.find({}).sort({_id:-1});
        res.status(200).json({status:'success', data: withdrawals, results: withdrawals.length});
    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', message:'Something went wrong'});
    }
}

exports.getPendingWithdrawals = async (req,res,next) => {
    try{
        const pendingWithdrawals = await Withdrawal.find({withdrawalStatus:'Pending'}).populate('user', 'first_name last_name mobile upiId bankName accountNumber ifscCode googlePay_number phonePe_number payTM_number nameAsPerBankAccount').populate('userWallet', 'transactions').sort({_id:-1});
        res.status(200).json({status:'success', data: pendingWithdrawals, results: pendingWithdrawals.length})
    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', message:'Something went wrong'});
    }
}

exports.getRejectedWithdrawals = async (req,res,next) => {
    try{
        const rejectedWithdrawals = await Withdrawal.find({withdrawalStatus:'Rejected'}).populate('user', 'first_name last_name mobile upiId bankName accountNumber ifscCode googlePay_number phonePe_number payTM_number nameAsPerBankAccount').sort({_id:-1});
        res.status(200).json({status:'success', data: rejectedWithdrawals, results: rejectedWithdrawals.length})
    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', message:'Something went wrong'});
    }
}
exports.getApprovedWithdrawals = async (req,res,next) => {
    try{
        const rejectedWithdrawals = await Withdrawal.find({withdrawalStatus:'Processed'}).populate('user', 'first_name last_name mobile upiId bankName accountNumber ifscCode googlePay_number phonePe_number payTM_number nameAsPerBankAccount').sort({_id:-1});
        res.status(200).json({status:'success', data: rejectedWithdrawals, results: rejectedWithdrawals.length})
    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', message:'Something went wrong'});
    }
}

exports.getInitiatedWithdrawals = async (req, res, next) => {
    try{
        const initiatedWithdrawals = await Withdrawal.find({withdrawalStatus:'Initiated'}).populate('user', 'first_name last_name mobile upiId bankName accountNumber ifscCode googlePay_number phonePe_number payTM_number nameAsPerBankAccount').populate('userWallet', 'transactions').sort({_id:-1});
        res.status(200).json({status:'success', data: initiatedWithdrawals, results: initiatedWithdrawals.length})
    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', message:'Something went wrong'});
    }
}

exports.getWithdrawalsUser = async (req,res,next) => {
    try{
        const userId = req.params.id;
        const withdrawals = await Withdrawal.find({user:userId});
        res.status(200).json({status:'success', data:withdrawals, results: withdrawals.length});
    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', message:'Something went wrong'});
    }
}

exports.processWithdrawal = async(req,res,next) => {
    const withdrawalId = req.params.id;
    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        const withdrawal = await Withdrawal.findById(withdrawalId);
        if(withdrawal.withdrawalStatus == 'Initiated'){
            return res.status(400).json({status:'error', message:'Already initiated'})
        }
        withdrawal.withdrawalStatus = 'Initiated';
        withdrawal.actions.push({
            actionDate: new Date(),
            actionTitle:'Withdrawal request recieved',
            actionBy:req.user._id,
            actionStatus:'Processing',
        });
        await withdrawal.save({validateBeforeSave:'false', session: session});
        const user = await User.findById(withdrawal.user); 
        await createUserNotification({
            title:'Withdrawal Request Under Process',
            description:`Your withdrawal request is being processed. It will take 3-5 business days to reflect in your account`,
            notificationType:'Individual',
            notificationCategory:'Informational',
            productCategory:'General',
            user: user?._id,
            priority:'Low',
            channels:['App', 'Email'],
            createdBy:'63ecbc570302e7cf0153370c',
            lastModifiedBy:'63ecbc570302e7cf0153370c'  
          }, session);
        res.status(200).json({status:'success', message:'Withdrawal Initiated'});
        if(process.env.PROD=='true'){
            await sendMail(user?.email, 'Withdrawal Request Initiated - StoxHero', `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Withdrawal Initiated</title>
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
                <h1>Withdrawal Initiated</h1>
                <p>Hello ${user.first_name},</p>
                <p>Your withdrawal request for ₹${withdrawal.amount} is initiated by StoxHero team and currently is under proceesing.</p>
                <p>It will at most take 3-4 business days to be processed. You'll be notified about the transaction status in the upcoming emails.</p>
                <p>In case of any discrepencies, raise a ticket or reply to this message.</p>
                <a href="https://stoxhero.com/contact" class="login-button">Write to Us Here</a>
                <br/><br/>
                <p>Thanks,</p>
                <p>StoxHero Team</p>
        
                </div>
            </body>
            </html>
        
        ` )
        }
        await session.commitTransaction();
    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', message:'Something went wrong'});
        await session.abortTransaction();
      }finally{
        await session.endSession();
      }
}

exports.rejectWithdrawal = async(req,res,next) => {
    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        const withdrawalId = req.params.id;
        const withdrawal = await Withdrawal.findById(withdrawalId);
        if(!withdrawal) return res.status(404).json({status:'error', message: 'No withdrawal found.'})
        if(withdrawal.withdrawalStatus == 'Rejected') return res.status(404).json({status:'error', message: 'Already rejected.'});
        withdrawal.withdrawalStatus = 'Rejected';
        withdrawal.lastModifiedBy = req.user._id;
        withdrawal.lastModifiedOn= new Date();
        withdrawal.rejectionReason = req.body.rejectionReason;
        if(withdrawal?.actions[withdrawal?.actions?.length-1]?.actionStatus=='Processing'){
            withdrawal.actions.push({
                actionDate: new Date(),
                actionTitle:'Withdrawal request rejected',
                actionBy:req.user._id,
                actionStatus:'Closed',
            });
        }else{
            withdrawal.actions.push({
                actionDate: new Date(),
                actionTitle:'Withdrawal request received',
                actionBy:req.user._id,
                actionStatus:'Processing',
            });
            withdrawal.actions.push({
                actionDate: new Date(),
                actionTitle:'Withdrawal request rejected',
                actionBy:req.user._id,
                actionStatus:'Closed',
            });
        }
     //withdrawal?.walletTxnId -> userWallet?.transacations filter for txnId = withdrawal?.wallettxnId -> wallet txn object -> in title withdrawalNo-> withdrawalNo
        const userWallet= await Wallet.findById(withdrawal?.userWallet);
        const walletTxnId = withdrawal?.walletTransactionId;
        const walletTxnObj = userWallet?.transactions?.filter(elem=>elem?.transactionId == walletTxnId);
        const withdrawalNo = walletTxnObj?.description?.split('#')[1];
        const withdrawalTransaction = userWallet?.transactions?.find((item)=>item?.transactionId == withdrawal?.walletTransactionId);
        if(withdrawalTransaction) withdrawalTransaction['transactionStatus'] = 'Failed';
    
        userWallet?.transactions?.push(
            {
                title:`Refund`, 
                description:`Withdrawal request rejected - Withdrawal${withdrawalNo}`, //add withdrawal No.
                amount: withdrawal?.amount,
                transactionId: uuid.v4(),
                transactionType: 'Cash',
                transactionStatus:'Completed'
            }
        );
        await createUserNotification({
            title:'Withdrawal Request Rejected',
            description:`Withdrwal #${withdrawalNo} request rejected. Reason - ${req.body.rejectionReason}`,
            notificationType:'Individual',
            notificationCategory:'Informational',
            productCategory:'General',
            user: user?._id,
            priority:'High',
            channels:['App', 'Email'],
            createdBy:'63ecbc570302e7cf0153370c',
            lastModifiedBy:'63ecbc570302e7cf0153370c'  
          }, session);
        await userWallet.save({validateBeforeSave:false, session: session});
        await withdrawal.save({validateBeforeSave:false, session:session});
        const user = await User.findById(withdrawal.user).select('email first_name last_name');
        if(process.env.PROD == 'true'){
            await sendMail(user?.email, 'Withdrawal Rejected - StoxHero ', `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Withdrawal Rejected</title>
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
                <h1>Withdrawal Rejected</h1>
                <p>Hello ${user.first_name},</p>
                <p>Your withdrawal request for ₹${withdrawal.amount} is rejected by stoxhero.</p>
                <p>Reason for rejection: <span class="userid">${rejectionReason}</span></p>
                <p>In case of any discrepencies, raise a ticket or reply to this message.</p>
                <a href="https://stoxhero.com/contact" class="login-button">Write to Us Here</a>
                <br/><br/>
                <p>Thanks,</p>
                <p>StoxHero Team</p>
        
                </div>
            </body>
            </html>
        
        ` )
        }
        await session.commitTransaction();
        res.status(200).json({status:'success', message:'Withdrawal request rejected'});
    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', message:'Something went wrong'});
        await session.abortTransaction();
    }finally{
      await session.endSession();
    }
} 

exports.approveWithdrawal = async(req, res, next) => {
    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        const withdrawalId = req.params.id;
        // console.log('req body', req.body);
        const{transactionId, settlementMethod, settlementAccount, recipientReference} = req.body;
        if(!transactionId || !settlementMethod || !settlementAccount || !recipientReference ){
            return res.status(404).json({status:'error', message: 'Required fields missing'});
        }
        const withdrawal = await Withdrawal.findById(withdrawalId);
        if(!withdrawal) return res.status(404).json({status:'error', message: 'No withdrawal found.'});
        if(withdrawal.withdrawalStatus == 'Processed'){
            return res.status(400).json({status:'error', message: 'This request has been resolved.'});   
        }
        withdrawal.withdrawalStatus = 'Processed';
        withdrawal.lastModifiedBy = req.user._id;
        withdrawal.lastModifiedOn= new Date();
        withdrawal. settlementTransactionId = transactionId;
        withdrawal.settlementMethod = settlementMethod;
        withdrawal.settlementAccount = settlementAccount;
        withdrawal.recipientReference = recipientReference;
        if(req.uploadUrl){
            withdrawal.transactionDocument = req.uploadUrl;
        }
    
        withdrawal.withdrawalSettlementDate = new Date();
        if(withdrawal?.actions[withdrawal?.actions?.length-1]?.actionStatus=='Processing'){
            withdrawal.actions.push({
                actionDate: new Date(),
                actionTitle:'Withdrawal request accepted',
                actionBy:req.user._id,
                actionStatus:'Closed',
            });
        }else{
            withdrawal.actions.push({
                actionDate: new Date(),
                actionTitle:'Withdrawal request received',
                actionBy:req.user._id,
                actionStatus:'Processing',
            });
            withdrawal.actions.push({
                actionDate: new Date(),
                actionTitle:'Withdrawal request accepted',
                actionBy:req.user._id,
                actionStatus:'Closed',
            });
        }    
    
    
        const userWallet= await Wallet.findById(withdrawal?.userWallet);
        const withdrawalTransaction = userWallet?.transactions?.find((item)=>item?.transactionId == withdrawal?.walletTransactionId);
        if(withdrawalTransaction) withdrawalTransaction['transactionStatus'] = 'Completed';
    
        await userWallet.save({validateBeforeSave:false ,session:session});
        await withdrawal.save({validateBeforeSave:false, session:session});
        const user = await User.findById(withdrawal.user).select('email first_name last_name');
        await createUserNotification({
            title:'Withdrawal Approved',
            description:`₹${withdrawal?.amount} is successfully deposited in your bank account.`,
            notificationType:'Individual',
            notificationCategory:'Informational',
            productCategory:'General',
            user: user?._id,
            priority:'High',
            channels:['App', 'Email'],
            createdBy:'63ecbc570302e7cf0153370c',
            lastModifiedBy:'63ecbc570302e7cf0153370c'  
          }, session);
        if(process.env.PROD=='true'){
            await sendMail(user.email, 
                "Withdrawal Approved - StoxHero",
                `
                        <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset="UTF-8">
                                <title>Withdrawal Approved</title>
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
                                <h1>Withdrawal Approved</h1>
                                <p>Hello ${user.first_name},</p>
                                <p>Your withdrawal request for ₹${withdrawal.amount} is approved by stoxhero. It'll be reflected in your bank account soon.</p>
                                <p>Transaction ID for the transfer: <span class="userid">${transactionId}</span></p>
                                <p>Mode of payment: <span class="userid">${settlementMethod}</span></p>
                                <p>In case of any discrepencies, raise a ticket or reply to this message.</p>
                                <a href="https://stoxhero.com/contact" class="login-button">Write to Us Here</a>
                                <br/><br/>
                                <p>Thanks,</p>
                                <p>StoxHero Team</p>
        
                                </div>
                            </body>
                            </html>
            
                        ` 
            )
        }
        await session.commitTransaction();
        res.status(200).json({status:'success', message:'Withdrawal request approved'});
    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', message:'Something went wrong'});
        await session.abortTransaction();
      }finally{
        await session.endSession();
      }
}
