const Portfolio = require('../models/userPortfolio/UserPortfolio');
const User = require('../models/User/userDetailSchema');
const Contest = require('../models/Contest/contestSchema');
const ContestTrade = require('../models/Contest/ContestTrade');
const ObjectId = require('mongodb').ObjectId;
const Subscription = require("../models/TenXSubscription/TenXSubscriptionSchema");

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el) && obj[el] !== null && obj[el] !== undefined && obj[el] !== '') {
        newObj[el] = obj[el];
      }
    });
    return newObj;
  };

exports.createPortfolio = async(req, res, next)=>{
    // console.log(req.body)
    const{portfolioName, portfolioValue, portfolioType, portfolioAccount, status
    } = req.body;
    if(await Portfolio.findOne({portfolioName})) return res.status(400).json({message:'This portfolio already exists.'});

    const portfolio = await Portfolio.create({portfolioName:portfolioName.trim(), portfolioValue, portfolioType, portfolioAccount, status, createdBy: req.user._id, lastModifiedBy: req.user._id});
    
    res.status(201).json({message: 'Portfolio successfully created.', data:portfolio});    
        

}

exports.getPortfolios = async(req, res, next)=>{
    try{
        const portfolio = await Portfolio.find({status: "Active"})
        
        res.status(201).json({status: 'success', data: portfolio, results: portfolio.length});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
        
};

exports.getContestPortolios = async(req, res, next)=>{
    try{
        const portfolio = await Portfolio.find({portfolioType: "Battle",status: "Active"})
        
        res.status(201).json({status: 'success', data: portfolio, results: portfolio.length});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
        
};

exports.getTenXPortolios = async(req, res, next)=>{
  try{
      const portfolio = await Portfolio.find({portfolioType: "TenX Trading",status: "Active"})
      
      res.status(201).json({status: 'success', data: portfolio, results: portfolio.length});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }
      
};

exports.getDailyContestPortolios = async(req, res, next)=>{
  try{
      const portfolio = await Portfolio.find({portfolioType: "Contest",status: "Active"})
      
      res.status(201).json({status: 'success', data: portfolio, results: portfolio.length});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }
      
};

exports.getTradingPortolios = async(req, res, next)=>{
    try{
        const portfolio = await Portfolio.find({portfolioType: "Virtual Trading",status:"Active"})
        
        res.status(201).json({status: 'success', data: portfolio, results: portfolio.length});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
        
};

exports.getInternshipPortolios = async(req, res, next)=>{
  try{
      const portfolio = await Portfolio.find({portfolioType: "Internship",status: "Active"})
      
      res.status(201).json({status: 'success', data: portfolio, results: portfolio.length});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }
      
};

exports.getInactivePortolios = async(req, res, next)=>{
    try{
        const portfolio = await Portfolio.find({status:"Inactive"})
        
        res.status(201).json({status: 'success', data: portfolio, results: portfolio.length});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
        
};


exports.getPortfolio = async(req, res, next)=>{
    
    const id = req.params.id ? req.params.id : '';
    try{
    const portfolio = await Portfolio.findById(id) 

    res.status(201).json({message: "Portfolio Retrived",data: portfolio});    
    }
    catch{(err)=>{res.status(401).json({message: "New Portfolio", error:err}); }}  
};

exports.editPortfolio = async(req, res, next) => {
    // console.log("in edit")
    const _id = req.params.id;
    // console.log("id is", _id)
    const portfolio = await Portfolio.findById(_id);
    // console.log(id, portfolio)
    const filteredBody = filterObj(req.body, "portfolioName", "portfolioValue", "portfolioType", "lastModifiedOn",
                          "status");

    filteredBody.lastModifiedBy = req.user._id;    

    await Portfolio.findByIdAndUpdate(_id, filteredBody);

    res.status(200).json({message: 'Successfully edited portfolio.'});
}

exports.editPortfolioWithName = async(req, res, next) => {
    // console.log("in edit")
    // const _id = req.params.id;
    // console.log("id is", _id)
    const portfolio = await Portfolio.find({portfolioName: req.body.portfolioName});
    // console.log(portfolio)
    const filteredBody = filterObj(req.body, "portfolioName", "portfolioValue", "portfolioType", "lastModifiedOn",
                          "status");

    filteredBody.lastModifiedBy = req.user._id;    

    await Portfolio.findOneAndUpdate({portfolioName: req.body.portfolioName}, filteredBody, {new: true});

    res.status(200).json({message: 'Successfully edited portfolio.'});
}


exports.myPortfolios = async(req,res,next) => {
    const userId = req.user._id;
    try{
        const myPortfolios = await Portfolio.find({status: "Active", "users.userId": userId})
        .select('_id portfolioName status portfolioValue portfolioAccount portfolioType')

        if(!myPortfolios){
            return res.status(404).json({status:'error', message: 'No portfolio found'});
        }

        res.status(200).json({status: 'success', data: myPortfolios, results: myPortfolios.length});

    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
}

exports.getUserPortfolio = async(req,res,next) => {
    
    try{
        const userId = req.user._id;
        // const userId = "64340f477818ebba306d49ad"

        const user = await User.findOne({_id: userId});
        const portfolioIds = user.portfolio.map(p => p.portfolioId);
        // console.log("portfolioIds", portfolioIds)
        // const myContests = await Contest.find({"participants.userId": userId, "participants.status": "Joined"});
        // console.log(new Date())
        const myContests = await Contest.find({
          "participants.userId": userId,
          "participants.status": "Joined",
          "contestEndDate": { $gt: new Date() },
          status: "Live"
        });
        // console.log("myContests", myContests)
        const filteredPortfolioIds = portfolioIds.filter(portfolioId => {
            // Check if the portfolioId is present in any of the myContests' participants
            return !myContests.some(contest => {
              return contest.participants && contest.participants.some(participant => {
                return participant.portfolioId && ((participant.portfolioId).equals(portfolioId) && (participant.userId).equals(userId));
              });
            });
          });
          

        // console.log("filteredPortfolioIds", result)
        const portfolios = await Portfolio.find({status: "Active", portfolioType: "Battle", _id: {$in: filteredPortfolioIds}});
        res.status(200).json({status: 'success', data: portfolios, results: portfolios.length});

    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
}

exports.getPortfolioRemainingAmount = async(req, res, next) => {
    const userId = req.user._id;
    const portfolioId = req.params.portfolioId;
    const contestId = req.params.contestId;
    try{
        let pnlDetails = await ContestTrade.aggregate([
            {
              $match: {
                status: "COMPLETE",
                trader: userId,
                portfolioId: new ObjectId(portfolioId),
                contestId: new ObjectId(contestId)
              },
            },
            {
              $group: {
                _id: {
                  portfolioId: "$portfolioId",
                },
                amount: {
                  $sum: {$multiply : ["$amount",-1]},
                },
                brokerage: {
                  $sum: {
                    $toDouble: "$brokerage",
                  },
                },
                lots: {
                  $sum: {
                    $toInt: "$Quantity",
                  },
                },
                lastaverageprice: {
                  $last: "$average_price",
                },
              },
            },
            {
              $sort: {
                _id: -1,
              },
            },
        ]);

        // console.log(userId, portfolioId)
        const portfolio = await Portfolio.findById(portfolioId).select('portfolioValue')

        res.status(201).json({pnl: pnlDetails, portfolio: portfolio});

    }catch(e){
        console.log(e);
        return res.status(500).json({status:'error', message: 'something went wrong.'})
    }
}

exports.getPortfolioPnl = async(req, res, next) => {
  const userId = req.user._id;
  try{
      let pnlDetails = await ContestTrade.aggregate([
          {
            $match: {
              status: "COMPLETE",
              trader: userId,
            },
          },
          {
            $group: {
              _id: {
                portfolioId: "$portfolioId",
              },
              amount: {
                $sum: {$multiply : ["$amount",-1]},
              },
              brokerage: {
                $sum: {
                  $toDouble: "$brokerage",
                },
              },
              lots: {
                $sum: {
                  $toInt: "$Quantity",
                },
              },
              lastaverageprice: {
                $last: "$average_price",
              },
            },
          },
          {
            $sort: {
              _id: -1,
            },
          },
      ]);

      res.status(201).json({status: "success", data: pnlDetails});

  }catch(e){
      console.log(e);
      return res.status(500).json({status:'success', message: 'something went wrong.'})
  }
}

exports.portfolioForMobile = async(req,res,next) => {
    
  try{
    let portfolios = [
      {
        _id: "6433e1fedde9f19917ce1d11",
        portfolioName: "Starter",
        status: "Active",
        portfolioValue: 100000,
        portfolioAccount: "Free",
        portfolioType: "Virtual Trading",
        investedAmount: 5000,
        cashBalance: 5000
      }
    ]
      res.status(200).json({status: 'success', data: portfolios, results: portfolios.length});

  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }
}

exports.myTenXPortfolio = async(req, res, next)=>{
  let pnlDetails = await Subscription.aggregate([
    {
      $unwind:
        {
          path: "$users",
        },
    },
    {
      $match: {
        "users.userId": new ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "user-portfolios",
        localField: "portfolio",
        foreignField: "_id",
        as: "portfolioData",
      },
    },
    {
      $lookup: {
        from: "tenx-trade-users",
        localField: "_id",
        foreignField: "subscriptionId",
        as: "trades",
      },
    },
    {
      $unwind:
        {
          path: "$trades",
          includeArrayIndex: "string",
        },
    },
    {
        $match: {
            "trades.status": "COMPLETE",
        },
    },
    {
      $group:
  
        {
          _id: {
            subscriptionId: "$_id",
            totalFund: {
              $arrayElemAt: [
                "$portfolioData.portfolioValue",
                0,
              ],
            },
            portfolioName: {
              $arrayElemAt: [
                "$portfolioData.portfolioName",
                0,
              ],
            },
            portfolioType: {
              $arrayElemAt: [
                "$portfolioData.portfolioType",
                0,
              ],
            },
            portfolioAccount: {
              $arrayElemAt: [
                "$portfolioData.portfolioAccount",
                0,
              ],
            },
          },
          totalAmount: {
            $sum:{
                $multiply: ["$trades.amount", -1],
            }
          },
          totalBrokerage: {
            $sum: "$trades.brokerage",
          },
        },
    },
    {
      $project:
  
        {
          _id: 0,
          subscriptionId: "$_id.subscriptionId",
          portfolioValue: "$_id.totalFund",
          portfolioType: "$_id.portfolioType",
          portfolioName: "$_id.portfolioName",
          portfolioAccount: "$_id.portfolioAccount",
          investedAmount: {
            $subtract: [
              "$totalAmount",
              "$totalBrokerage",
            ],
          },
          cashBalance: {
            $sum: [
                "$_id.totalFund",
                { $subtract: ["$totalAmount", "$totalBrokerage"] }
              ]
          }
        },
    },
  ]);

  res.status(201).json({status: "success", data: pnlDetails});

}

exports.myVirtualFreePortfolio = async(req, res, next)=>{
  // console.log("in free", req.user._id)
  let pnlDetails = await Portfolio.aggregate([
    {
      $match: {
        portfolioType: "Virtual Trading",
        portfolioAccount: "Free"
      },
    },
    {
      $unwind:
        {
          path: "$users",
        },
    },
    {
      $lookup: {
        from: "paper-trades",
        localField: "users.userId",
        foreignField: "trader",
        as: "trades",
      },
    },
    {
      $unwind:{
        path: "$trades",
      },
    },
    {
      $match: {
        "trades.trader": new ObjectId(req.user._id),
      },
    },
    {
      $group:
  
        {
          _id: {
            portfolioId: "$_id",
            totalFund: "$portfolioValue",
            portfolioName: "$portfolioName",
            portfolioType: "$portfolioType",
            portfolioAccount: "$portfolioAccount",
          },
          totalAmount: {
            $sum:{
                $multiply: ["$trades.amount", -1],
            }
          },
          totalBrokerage: {
            $sum: "$trades.brokerage",
          },
        },
    },
    {
      $project:
  
        {
          _id: 0,
          portfolioId: "$_id.portfolioId",
          portfolioValue: "$_id.totalFund",
          portfolioType: "$_id.portfolioType",
          portfolioName: "$_id.portfolioName",
          portfolioAccount: "$_id.portfolioAccount",
          investedAmount: {
            $subtract: [
              "$totalAmount",
              "$totalBrokerage",
            ],
          },
          cashBalance: {
            $sum: [
                "$_id.totalFund",
                { $subtract: ["$totalAmount", "$totalBrokerage"] }
              ]
          }
        },
    },
  ]);
  // console.log("pnlDetails", pnlDetails)
  res.status(201).json({status: "success", data: pnlDetails});

}


