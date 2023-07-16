const { ObjectId } = require("mongodb");
const Payment = require("../models/Payment/payment");
const UserWallet = require("../models/UserWallet/userWalletSchema")
const uuid = require("uuid")
const User = require("../models/User/userDetailSchema");

exports.createPayment = async(req, res, next)=>{
    console.log(req.body)
    const{paymentTime, transactionId, amount, paymentBy, currency, 
        paymentFor, paymentMode, paymentStatus } = req.body;

    const orderId = `SHSID${amount}${transactionId}`;
    try{
        if(await Payment.findOne({transactionId : transactionId })) return res.status(400).json({info:'This payment is already exists.'});
        const payment = await Payment.create({paymentTime, transactionId, amount, paymentBy, currency, 
            paymentFor, paymentMode, paymentStatus, createdBy: req.user._id, lastModifiedBy: req.user._id});
        
        const wallet = await UserWallet.findOne({userId: new ObjectId(paymentBy)});
        wallet.transactions = [...wallet.transactions, {
                title: 'Amount Credit',
                description: `The amount that has been credited to your wallet.`,
                amount: (amount),
                transactionId: uuid.v4(),
                transactionType: 'Cash'
        }];
        wallet.save();


        res.status(201).json({message: 'Payment successfully.', data:payment, count:payment.length});
    }catch(error){
        console.log(error)
    } 
}

exports.getPayment = async(req, res, next)=>{
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10

    const count = await Payment.countDocuments();
    const payment = await Payment.find().select('_id paymentTime transactionId amount paymentBy paymentMode paymentStatus currency')
    .populate('paymentBy', 'first_name last_name email mobile')
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);
    
    res.status(201).json({message: "payment retreived", data: payment, count: count});    
        
};

exports.getUserPayment = async(req, res, next)=>{
    
    const id = req.params.id
    try{
        const userPayment = await Payment.findOne({userId: id}).select('_id paymentTime transactionId amount paymentBy paymentMode paymentStatus currency')
        res.status(201).json({message: "userPayment Retrived",data: userPayment});    
    }
    catch{(err)=>{res.status(401).json({message: "err userPayment", error:err}); }}  
};

// Controller for getting users
exports.getUsers = async (req, res) => {
    const searchString = req.query.search;
    try {
        const data = await User.find({
            $and: [
                {
                    $or: [
                        { email: { $regex: searchString, $options: 'i' } },
                        { first_name: { $regex: searchString, $options: 'i' } },
                        { last_name: { $regex: searchString, $options: 'i' } },
                        { mobile: { $regex: searchString, $options: 'i' } },
                    ]
                },
                {
                    status: 'Active',
                },
            ]
        })
        res.status(200).json({
            status: "success",
            message: "Getting User successfully",
            data: data
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};