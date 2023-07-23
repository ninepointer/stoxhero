const { ObjectId } = require("mongodb");
const Payment = require("../models/Payment/payment");
const UserWallet = require("../models/UserWallet/userWalletSchema")
const uuid = require("uuid")
const User = require("../models/User/userDetailSchema");
const sendMail = require('../utils/emailService');

exports.createPayment = async(req, res, next)=>{
    // console.log(req.body)
    const{paymentTime, transactionId, amount, paymentBy, currency, 
        paymentFor, paymentMode, paymentStatus } = req.body;

    // const orderId = `SHSID${amount}${transactionId}`;
    const user = await User.findOne({_id: new ObjectId(paymentBy)});
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

        if(process.env.PROD == 'true'){
            sendMail(user?.email, 'Amount Credited - StoxHero', `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Amount Credited</title>
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
                <h1>Amount Credited</h1>
                <p>Hello ${user.first_name},</p>
                <p>Amount of ${amount}INR has been credited in you wallet</p>
                <p>You can now purchase Tenx and play contest.</p>
                
                <p>In case of any discrepencies, raise a ticket or reply to this message.</p>
                <a href="https://stoxhero.com/contact" class="login-button">Write to Us Here</a>
                <br/><br/>
                <p>Thanks,</p>
                <p>StoxHero Team</p>
      
                </div>
            </body>
            </html>
            `);
        }

        res.status(201).json({message: 'Payment successfully.', data:payment, count:payment.length});
    }catch(error){
        console.log(error)
    } 
}

exports.getPayment = async(req, res, next)=>{
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10

    const count = await Payment.countDocuments();
    const payment = await Payment.find().select('_id paymentTime transactionId amount paymentBy paymentMode paymentStatus currency createdOn')
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