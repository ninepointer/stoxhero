const Withdrawal = require('../models/withdrawal/withdrawal');
const User = require('../models/User/userDetailSchema');
const Wallet = require('../models/UserWallet/userWalletSchema');
const uuid = require('uuid');


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
    const pendingWithdrawals = await Withdrawal.find({withdrawalStatus:'Pending'});
    res.status(200).json({status:'success', data: pendingWithdrawals, results: pendingWithdrawals.length})
}

exports.getRejectedWithdrawals = async (req,res,next) => {
    const rejectedWithdrawals = await Withdrawal.find({withdrawalStatus:'Pending'});
    res.status(200).json({status:'success', data: rejectedWithdrawals, results: rejectedWithdrawals.length})
}

exports.getInitiatedWithdrawals = async (req, res, next) => {
    const initiatedWithdrawals = await Withdrawal.find({withdrawalStatus:'Initiated'});
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
    const withdrawalId = req.params.id;
    const withdrawal = await Withdrawal.findById(withdrawalId);
    if(!withdrawal) return res.status(404).json({status:'error', message: 'No withdrawal found.'})
    withdrawal.withdrawalStatus = 'Rejected';
    withdrawal.lastModifiedBy = req.user._id;
    withdrawal.lastModifiedOn= new Date();
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
    const{transactionId, settlementMethod, settlementAccount} = req.body;
    const withdrawal = await Withdrawal.findById(withdrawalId);
    if(!withdrawal) return res.status(404).json({status:'error', message: 'No withdrawal found.'})
    withdrawal.withdrawalStatus = 'Processed';
    withdrawal.lastModifiedBy = req.user._id;
    withdrawal.lastModifiedOn= new Date();
    withdrawal. settlementTransactionId = transactionId;
    withdrawal.settlementMethod = settlementMethod;
    withdrawal.settlementAccount = settlementAccount;
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
    res.status(200).json({status:'success', message:'Withdrawal request approved'});
}
