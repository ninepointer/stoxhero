const Payment = require("../models/Payment/payment");

exports.createPayment = async(req, res, next)=>{
    console.log(req.body)
    const{paymentTime, referenceNo, transactionId, amount, userId,
          subscriptionId, paymentMode, paymentStatus } = req.body;

    const orderId = `SHSID${amount}${transactionId}`;
    try{
        if(await Payment.findOne({transactionId : transactionId })) return res.status(400).json({info:'This payment is already exists.'});
        const payment = await Payment.create({orderId, paymentTime, referenceNo, transactionId, amount, userId,
            subscriptionId, paymentMode, paymentStatus, createdBy: req.user._id, lastModifiedBy: req.user._id});
        console.log("Payment: ",payment)
        res.status(201).json({message: 'Payment created successfully.', data:payment, count:payment.length});
    }catch(error){
        console.log(error)
    } 
}

exports.getPayment = async(req, res, next)=>{

    const payment = await Payment.find().select('_id orderId paymentTime referenceNo transactionId amount userId subscriptionId paymentMode paymentStatus'); 
    
    res.status(201).json({message: "payment retreived", data: payment});    
        
};

exports.getUserPayment = async(req, res, next)=>{
    
    const id = req.params.id
    try{
        const userPayment = await Payment.findOne({userId: id}).select('_id orderId paymentTime referenceNo transactionId amount userId subscriptionId paymentMode paymentStatus')
        res.status(201).json({message: "userPayment Retrived",data: userPayment});    
    }
    catch{(err)=>{res.status(401).json({message: "err userPayment", error:err}); }}  
};