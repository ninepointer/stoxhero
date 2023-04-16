const Portfolio = require('../models/userPortfolio/UserPortfolio');
const User = require('../models/User/userDetailSchema');
const Contest = require('../models/Contest/contestSchema');
const ContestTrade = require('../models/Contest/ContestTrade');

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
    console.log(req.body)
    const{portfolioName, portfolioValue, portfolioType, portfolioAccount, status
    } = req.body;
    if(await Portfolio.findOne({portfolioName})) return res.status(400).json({message:'This portfolio already exists.'});

    const portfolio = await Portfolio.create({portfolioName, portfolioValue, portfolioType, portfolioAccount, status, createdBy: req.user._id, lastModifiedBy: req.user._id});
    
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
        const portfolio = await Portfolio.find({portfolioType: "Contest",status: "Active"})
        
        res.status(201).json({status: 'success', data: portfolio, results: portfolio.length});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
        
};

exports.getTradingPortolios = async(req, res, next)=>{
    try{
        const portfolio = await Portfolio.find({portfolioType: "Trading",status:"Active"})
        
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
    console.log("in edit")
    const _id = req.params.id;
    console.log("id is", _id)
    const portfolio = await Portfolio.findById(_id);
    console.log(id, portfolio)
    const filteredBody = filterObj(req.body, "portfolioName", "portfolioValue", "portfolioType", "lastModifiedOn",
                          "status");

    filteredBody.lastModifiedBy = req.user._id;    

    await Portfolio.findByIdAndUpdate(_id, filteredBody);

    res.status(200).json({message: 'Successfully edited portfolio.'});
}

exports.editPortfolioWithName = async(req, res, next) => {
    console.log("in edit")
    // const _id = req.params.id;
    // console.log("id is", _id)
    const portfolio = await Portfolio.find({portfolioName: req.body.portfolioName});
    console.log(portfolio)
    const filteredBody = filterObj(req.body, "portfolioName", "portfolioValue", "portfolioType", "lastModifiedOn",
                          "status");

    filteredBody.lastModifiedBy = req.user._id;    

    await Portfolio.findOneAndUpdate({portfolioName: req.body.portfolioName}, filteredBody, {new: true});

    res.status(200).json({message: 'Successfully edited portfolio.'});
}


exports.myPortfolios = async(req,res,next) => {
    const userId = req.user._id;
    try{
        const myPortfolios = await Portfolio.find({status: "Active", "users.userId": userId});

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
          "contestEndDate": { $gt: new Date() }
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
        const portfolios = await Portfolio.find({status: "Active", _id: {$in: filteredPortfolioIds}});



        res.status(200).json({status: 'success', data: portfolios, results: portfolios.length});

    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
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

        res.status(201).json(pnlDetails);

    }catch(e){
        console.log(e);
        return res.status(500).json({status:'success', message: 'something went wrong.'})
    }
}



// myContests =  [
//   {
//     entryFee: { amount: 0, currency: 'INR' },
//     _id: new ObjectId("6438e04991b137b346afb4b9"),
//     contestName: 'Monday Madness',
//     contestStartDate: 2023-04-17T03:45:02.000Z,
//     contestEndDate: 2023-04-17T09:55:02.000Z,
//     contestMargin: 1000000,
//     entryOpeningDate: 2023-04-14T05:15:02.000Z,
//     entryClosingDate: 2023-04-16T17:00:02.000Z,
//     stockType: 'Options',
//     contestOn: 'NIFTY 50',
//     rewards: [ [Object], [Object], [Object] ],
//     contestRule: new ObjectId("64285b52a13b875fa2da713b"),
//     instruments: [],
//     maxParticipants: 10,
//     minParticipants: 3,
//     status: 'Live',
//     createdOn: 2023-04-14T04:48:01.761Z,
//     lastModifiedOn: 2023-04-14T04:48:01.761Z,
//     createdBy: new ObjectId("63788f7591fc4bf629de6e59"),
//     lastModifiedBy: new ObjectId("63788f7591fc4bf629de6e59"),
//     participants: [ ],
//     __v: 2
//   },
//   {
//     entryFee: { amount: 0, currency: 'INR' },
//     _id: new ObjectId("6438e36ae1613d101b36c3f6"),
//     contestName: 'Wednesday Break',
//     contestStartDate: 2023-04-19T03:45:05.000Z,
//     contestEndDate: 2023-04-19T07:00:05.000Z,
//     contestMargin: 1000000,
//     entryOpeningDate: 2023-04-14T04:00:05.000Z,
//     entryClosingDate: 2023-04-16T17:00:05.000Z,
//     stockType: 'Options',
//     contestOn: 'NIFTY 50',
//     rewards: [ [Object], [Object], [Object] ],
//     contestRule: new ObjectId("64285b52a13b875fa2da713b"),
//     instruments: [],
//     maxParticipants: 4,
//     minParticipants: 50,
//     status: 'Live',
//     createdOn: 2023-04-14T05:19:31.170Z,
//     lastModifiedOn: 2023-04-14T05:19:31.170Z,
//     createdBy: new ObjectId("63788f7591fc4bf629de6e59"),
//     lastModifiedBy: new ObjectId("63788f7591fc4bf629de6e59"),
//     __v: 9,
//     participants: [ {

//     } ]
//   }
// ]