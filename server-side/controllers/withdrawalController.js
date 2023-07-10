const Withdrawal = require('../models/withdrawal/withdrawal');
const User = require('../models/User/userDetailSchema');
const Wallet = require('../models/UserWallet/userWalletSchema');
const uuid = require('uuid');
const sendMail = require('../utils/emailService')

const multer = require('multer');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
console.log("File upload started");
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
console.log("Upload:",upload)
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


exports.uploadMulter = upload;

exports.resizePhoto = (req, res, next) => {
    if (!req.file) {
      // no file uploaded, skip to next middleware
      console.log('no file');
      next();
      return;
    }
    sharp(req.file.buffer).resize({width: 500, height: 500}).toBuffer()
    .then((resizedImageBuffer) => {
      req.file.buffer = resizedImageBuffer;
      console.log("Resized:",resizedImageBuffer)
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
        console.log('file uploaded');
        console.log(s3Data.Location);
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

    const userWallet = await Wallet.findOne({userId});
    const walletBalance = userWallet?.transactions.reduce((acc, obj) => (obj?.transactionStatus != 'Failed'?acc + obj.amount:acc), 0);
    console.log('the wallet balance', walletBalance);
    
    if(amount>walletBalance){
        return res.status(400).json({status:'error', message:'You don\'t have enough funds for the withdrawal.'})
    }

    if(amount<200){
        return res.status(400).json({status:'error', message:'The minimum amount that can be withdrawn is ₹200'})
    }
    const transactionId = uuid.v4();
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
        title:`Withdrawal of ₹${amount} to bank account`, 
        description:'User initiated withdrawal from wallet',
        amount: -amount,
        transactionId,
        transactionType: 'Cash',
        transactionStatus:'Pending'
    });
    await userWallet.save({validateBeforeSave:false});
    res.status(201).json({status:'success', message:'Withdrawal request successful'});
}

exports.getAllWithdrwals = async (req, res, next) => {
    const withdrawals = await Withdrawal.find({});
    res.status(200).json({status:'success', data: withdrawals, results: withdrawals.length})
}

exports.getPendingWithdrawals = async (req,res,next) => {
    const pendingWithdrawals = await Withdrawal.find({withdrawalStatus:'Pending'}).populate('user', 'first_name last_name mobile');
    res.status(200).json({status:'success', data: pendingWithdrawals, results: pendingWithdrawals.length})
}

exports.getRejectedWithdrawals = async (req,res,next) => {
    const rejectedWithdrawals = await Withdrawal.find({withdrawalStatus:'Rejected'}).populate('user', 'first_name last_name mobile');
    res.status(200).json({status:'success', data: rejectedWithdrawals, results: rejectedWithdrawals.length})
}
exports.getApprovedWithdrawals = async (req,res,next) => {
    const rejectedWithdrawals = await Withdrawal.find({withdrawalStatus:'Processed'}).populate('user', 'first_name last_name mobile');
    res.status(200).json({status:'success', data: rejectedWithdrawals, results: rejectedWithdrawals.length})
}

exports.getInitiatedWithdrawals = async (req, res, next) => {
    const initiatedWithdrawals = await Withdrawal.find({withdrawalStatus:'Initiated'}).populate('user', 'first_name last_name mobile');
    res.status(200).json({status:'success', data: initiatedWithdrawals, results: initiatedWithdrawals.length})
}

exports.getWithdrawalsUser = async (req,res,next) => {
    const userId = req.params.id;
    const withdrawals = await Withdrawal.find({user:userId});
    res.status(200).json({status:'success', data:withdrawals, results: withdrawals.length});
}

exports.processWithdrawal = async(req,res,next) => {
    const withdrawalId = req.params.id;
    const withdrawal = await Withdrawal.findById(withdrawalId);
    withdrawal.withdrawalStatus = 'Initiated';
    withdrawal.actions.push({
        actionDate: new Date(),
        actionTitle:'Withdrawal request recieved',
        actionBy:req.user._id,
        actionStatus:'Processing',
    });
    await withdrawal.save({validateBeforeSave:'false'});

    res.status(200).json({status:'success', message:'Withdrawal Initiated'});

}

exports.rejectWithdrawal = async(req,res,next) => {
    console.log('req body', req.body);
    const withdrawalId = req.params.id;
    const withdrawal = await Withdrawal.findById(withdrawalId);
    if(!withdrawal) return res.status(404).json({status:'error', message: 'No withdrawal found.'})
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

    const userWallet= await Wallet.findById(withdrawal?.userWallet);
    const withdrawalTransaction = userWallet?.transactions?.find((item)=>item?.transactionId == withdrawal?.walletTransactionId);
    if(withdrawalTransaction) withdrawalTransaction['transactionStatus'] = 'Failed';

    userWallet?.transactions?.push(
        {
            title:`Refund to wallet against withdrawal request`, 
            description:'Withdrawal request rejected',
            amount: withdrawal?.amount,
            transactionId: uuid.v4(),
            transactionType: 'Cash',
            transactionStatus:'Completed'
        }
    );
    await userWallet.save({validateBeforeSave:false});
    await withdrawal.save({validateBeforeSave:false});
    res.status(200).json({status:'success', message:'Withdrawal request rejected'});
} 

exports.approveWithdrawal = async(req, res, next) => {
    const withdrawalId = req.params.id;
    console.log('req body', req.body);
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

    await userWallet.save({validateBeforeSave:false});
    await withdrawal.save({validateBeforeSave:false});
    const user = await User.findById(withdrawal.user);
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
    res.status(200).json({status:'success', message:'Withdrawal request approved'});
}
