const InfinityLiveCompany = require("../models/TradeDetails/liveTradeSchema")
const InfinityCompany = require("../models/mock-trade/infinityTradeCompany")
const getKiteCred = require('../marketData/getKiteCred'); 
// const RequestToken = require("../models/Trading Account/requestTokenSchema");
const DailyContestCompany = require("../models/DailyContest/dailyContestMockCompany")
const singleLivePrice = require('../marketData/sigleLivePrice');
const SaveMock = require("../models/marginUsed/mockMarginUsed")
const SaveLive = require("../models/marginUsed/liveMarginUsed")
const SaveDailyContestMock = require("../models/DailyContest/dailycontestMockMarginUsed")
const SaveDailyContestLive = require("../models/DailyContest/dailycontestLiveMarginUsed")
const SaveXTSLive = require("../models/marginUsed/xtsOverallMarginUsed")

const RequestToken = require("../models/Trading Account/requestTokenSchema");
const axios = require("axios");
const {xtsAccountType} = require("../constant");
// const InfinityMockCompanyMargin = require("../models/marginUsed/infinityMockCompanyMargin");
const InfinityMarginCompanyMock = require("../models/marginUsed/infinityMockCompanyMargin")
const InfinityMarginCompanyLive = require("../models/marginUsed/infinityLiveCompanyMargin")
const InfinityMarginTraderMock = require("../models/marginUsed/infinityMockUserMargin")
const InfinityMarginTraderLive = require("../models/marginUsed/infinityLiveUserMargin")

exports.infinityMargin = async (req, res) => {

  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  let total = await InfinityMarginCompanyMock.aggregate([
    {
      $match: {
        date: {
          $gte: today
        },
      },
    },
    {
      $group:
  
        {
          _id: {
          },
          margin_released: {
            $sum: "$margin_released",
          },
          margin_utilize: {
            $sum: "$margin_utilize",
          },
        },
    },
    {
      $project:
        {
          _id: 0,
          total: {
            $subtract: [
              "$margin_utilize",
              "$margin_released",
            ],
          },
        },
    },
  ])
  // console.log(total)
  res.status(200).json({message: "infinity margin data", data: total[0]?.total ? total[0]?.total : 0})
}

exports.DailyContestMargin = async (req, res) => {
  getKiteCred.getAccess().then(async (data) => {
      let total = 0;
      // const userId = req.user._id;
      let date = new Date();
      let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      todayDate = todayDate + "T00:00:00.000Z";
      const today = new Date(todayDate);
  
      let auth = 'token ' + data.getApiKey + ':' + data.getAccessToken;
      let headers = {
        'X-Kite-Version': '3',
        'Authorization': auth,
        "content-type": "application/json"
      }
      let pnlLiveDetails = await DailyContestCompany.aggregate([
          {
            $lookup: {
              from: 'algo-tradings',
              localField: 'algoBox',
              foreignField: '_id',
              as: 'algo'
            }
          },
          {
            $match: {
              trade_time: {
                $gte: today
              },
              status: "COMPLETE",
              "algo.isDefault": true
            },
          },
          {
            $group: {
              _id: {
                symbol: "$symbol",
                product: "$Product",
                instrumentToken: "$instrumentToken",
                exchangeInstrumentToken: "$exchangeInstrumentToken",
                exchange: "$exchange",
                variety: "$variety",
                order_type: "$order_type",
                trader: "$trader"
              },
              lots: {
                $sum: {
                  $toInt: "$Quantity",
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              symbol: "$_id.symbol",
              product: "$_id.product",
              amount: 1,
              brokerage: 1,
              instrumentToken: "$_id.instrumentToken",
              exchangeInstrumentToken: "$_id.exchangeInstrumentToken",
              lots: 1,
              exchange: "$_id.exchange",
              variety: "$_id.variety",
              order_type: "$_id.order_type",
              trader: "$_id.trader"
            },
          },
      ])


      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      async function processPnlLiveDetails() {
        for (let i = 0; i < pnlLiveDetails.length; i++) {
          if (pnlLiveDetails[i].lots !== 0) {
            let buyOrSell = pnlLiveDetails[i].lots > 0 ? "BUY" : "SELL";
            let orderData = [{
              "exchange": pnlLiveDetails[i].exchange,
              "tradingsymbol": pnlLiveDetails[i].symbol,
              "transaction_type": buyOrSell,
              "variety": pnlLiveDetails[i].variety,
              "product": pnlLiveDetails[i].product,
              "order_type": pnlLiveDetails[i].order_type,
              "quantity": Math.abs(pnlLiveDetails[i].lots),
              "price": 0,
              "trigger_price": 0
            }];

            console.log("orderData", orderData);
            let marginData;
            let zerodhaMargin;

            try {
              marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, { headers: headers });
              zerodhaMargin = marginData.data.data.orders[0].total;
              total += zerodhaMargin;
              // console.log(zerodhaMargin);
              // console.log(total, marginData.data.data);
            } catch (e) {
              console.log("error fetching zerodha margin", e);
            }

            await delay(300);
          }

        }
      }

      await processPnlLiveDetails();
  
  
      res.status(200).json({message: "margin data", data: total})
  
  });  
}

exports.saveLiveUsedMargin = async ()=>{
  getKiteCred.getAccess().then(async (data) => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
  
    let auth = 'token ' + data.getApiKey + ':' + data.getAccessToken;
    let headers = {
      'X-Kite-Version': '3',
      'Authorization': auth,
      "content-type": "application/json"
    }
  
    let allTrade = await InfinityLiveCompany.aggregate([
      {
        $lookup: {
          from: 'algo-tradings',
          localField: 'algoBox',
          foreignField: '_id',
          as: 'algo'
        }
      },
      {
        $match: {
          trade_time: {
            $gte: today
          },
          status: "COMPLETE",
          "algo.isDefault": true
        },
      },
      {
        $group: {
          _id: {
            symbol: "$symbol",
            product: "$Product",
            instrumentToken: "$instrumentToken",
            exchangeInstrumentToken: "$exchangeInstrumentToken",
            exchange: "$exchange",
            variety: "$variety",
            order_type: "$order_type",
            trader: "$trader"
          },
          lots: {
            $sum: {
              $toInt: "$Quantity",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          symbol: "$_id.symbol",
          product: "$_id.product",
          amount: 1,
          brokerage: 1,
          instrumentToken: "$_id.instrumentToken",
          exchangeInstrumentToken: "$_id.exchangeInstrumentToken",
          lots: 1,
          exchange: "$_id.exchange",
          variety: "$_id.variety",
          order_type: "$_id.order_type",
          trader: "$_id.trader"
        },
      },
    ])
  
    // console.log(allTrade)
    let mapForParticularUser = new Map();
  
    for(let i = 0; i < allTrade.length; i++){
      let buyOrSell = allTrade[i].lots > 0 ? "BUY" : "SELL";
  
      if(mapForParticularUser.has(allTrade[i].symbol)){
        let obj = mapForParticularUser.get(allTrade[i].symbol)
        obj.noOfTrader += 1
        obj.quantity += allTrade[i].lots
      } else{
        mapForParticularUser.set(allTrade[i].symbol, {
  
          exchange: allTrade[i].exchange,
          symbol: allTrade[i].symbol,
          transaction_type: buyOrSell,
          variety: allTrade[i].variety,
          product: allTrade[i].product,
          order_type: allTrade[i].order_type,
          lots: allTrade[i].lots,
          noOfTrader: 1
        }) 
      }
  
    }
  
    let finalArr = [];
    for (let value of mapForParticularUser.values()){
      finalArr.push(value);
    }
  
    // console.log(finalArr)
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let tradeData = [];
    let time = new Date();
    async function processPnlLiveDetails() {
      for (let i = 0; i < finalArr.length; i++) {
        
        if (finalArr[i].lots !== 0) {
          let buyOrSell = finalArr[i].lots > 0 ? "BUY" : "SELL";
          let orderData = [{
            "exchange": finalArr[i].exchange,
            "tradingsymbol": finalArr[i].symbol,
            "transaction_type": buyOrSell,
            "variety": finalArr[i].variety,
            "product": finalArr[i].product,
            "order_type": finalArr[i].order_type,
            "quantity": Math.abs(finalArr[i].lots),
            "price": 0,
            "trigger_price": 0
          }];
  
          // console.log("orderData", orderData);
          let marginData;
          let zerodhaMargin;
  
          try {
            marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, { headers: headers });
            let liveData = await singleLivePrice(finalArr[i].exchange, finalArr[i].symbol)
            // console.log(liveData)
            zerodhaMargin = marginData.data.data.orders[0].total;
            // total += zerodhaMargin;
            // console.log(zerodhaMargin);
            tradeData.push({
              instrument: finalArr[i].symbol,
              marginRequired: zerodhaMargin,
              timestamp: time,
              runningLots: finalArr[i].lots,
              transaction_type: buyOrSell,
              noOfTrader: finalArr[i].noOfTrader,
              ltp: liveData?.last_price,
            })
            // console.log(total, marginData.data.data.orders[0]);
          } catch (e) {
            console.log("error fetching zerodha margin", e);
          }
        }
  
        await delay(300); // Introduce a delay of 300 ms
      }
    }
  
    await processPnlLiveDetails();
  
    try{
      const saveLive = await SaveLive.create(tradeData)
      // console.log(saveLive);
    } catch(err){
      console.log("saving margin used mock", err);
    }
    // console.log(tradeData)
  })
}

exports.saveMockUsedMargin = async ()=>{
  getKiteCred.getAccess().then(async (data) => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
  
    let auth = 'token ' + data.getApiKey + ':' + data.getAccessToken;
    let headers = {
      'X-Kite-Version': '3',
      'Authorization': auth,
      "content-type": "application/json"
    }
  
    let allTrade = await InfinityCompany.aggregate([
      {
        $lookup: {
          from: 'algo-tradings',
          localField: 'algoBox',
          foreignField: '_id',
          as: 'algo'
        }
      },
      {
        $match: {
          trade_time: {
            $gte: today
          },
          status: "COMPLETE",
          "algo.isDefault": true
        },
      },
      {
        $group: {
          _id: {
            symbol: "$symbol",
            product: "$Product",
            instrumentToken: "$instrumentToken",
            exchangeInstrumentToken: "$exchangeInstrumentToken",
            exchange: "$exchange",
            variety: "$variety",
            order_type: "$order_type",
            trader: "$trader"
          },
          lots: {
            $sum: {
              $toInt: "$Quantity",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          symbol: "$_id.symbol",
          product: "$_id.product",
          amount: 1,
          brokerage: 1,
          instrumentToken: "$_id.instrumentToken",
          exchangeInstrumentToken: "$_id.exchangeInstrumentToken",
          lots: 1,
          exchange: "$_id.exchange",
          variety: "$_id.variety",
          order_type: "$_id.order_type",
          trader: "$_id.trader"
        },
      },
    ])
  
    let mapForParticularUser = new Map();
  
    for(let i = 0; i < allTrade.length; i++){
      let buyOrSell = allTrade[i].lots > 0 ? "BUY" : "SELL";
  
      if(mapForParticularUser.has(allTrade[i].symbol)){
        let obj = mapForParticularUser.get(allTrade[i].symbol)
        obj.noOfTrader += 1
        obj.quantity += allTrade[i].lots
      } else{
        mapForParticularUser.set(allTrade[i].symbol, {
  
          exchange: allTrade[i].exchange,
          symbol: allTrade[i].symbol,
          transaction_type: buyOrSell,
          variety: allTrade[i].variety,
          product: allTrade[i].product,
          order_type: allTrade[i].order_type,
          lots: allTrade[i].lots,
          noOfTrader: 1
        }) 
      }
  
    }
  
    let finalArr = [];
    for (let value of mapForParticularUser.values()){
      finalArr.push(value);
    }
  
    // console.log(finalArr)
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let tradeData = [];
    let time = new Date();
    async function processPnlLiveDetails() {
      for (let i = 0; i < finalArr.length; i++) {
        
        if (finalArr[i].lots !== 0) {
          let buyOrSell = finalArr[i].lots > 0 ? "BUY" : "SELL";
          let orderData = [{
            "exchange": finalArr[i].exchange,
            "tradingsymbol": finalArr[i].symbol,
            "transaction_type": buyOrSell,
            "variety": finalArr[i].variety,
            "product": finalArr[i].product,
            "order_type": finalArr[i].order_type,
            "quantity": Math.abs(finalArr[i].lots),
            "price": 0,
            "trigger_price": 0
          }];
  
          // console.log("orderData", orderData);
          let marginData;
          let zerodhaMargin;
  
          try {
            marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, { headers: headers });
            let liveData = await singleLivePrice(finalArr[i].exchange, finalArr[i].symbol)
            console.log(liveData)
            zerodhaMargin = marginData.data.data.orders[0].total;
            // total += zerodhaMargin;
            // console.log(zerodhaMargin);
            tradeData.push({
              instrument: finalArr[i].symbol,
              marginRequired: zerodhaMargin,
              timestamp: time,
              runningLots: finalArr[i].lots,
              transaction_type: buyOrSell,
              noOfTrader: finalArr[i].noOfTrader,
              ltp: liveData?.last_price,
            })
            // console.log(total, marginData.data.data.orders[0]);
          } catch (e) {
            console.log("error fetching zerodha margin", e);
          }
        }
  
        await delay(300); // Introduce a delay of 300 ms
      }
    }
  
    await processPnlLiveDetails();
  
    try{
      const saveMock = await SaveMock.create(tradeData)
      // console.log(saveMock);
    } catch(err){
      console.log("saving margin used mock", err);
    }
    // console.log(tradeData)
  })
}

exports.saveMockDailyContestUsedMargin = async ()=>{
  getKiteCred.getAccess().then(async (data) => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
  
    let auth = 'token ' + data.getApiKey + ':' + data.getAccessToken;
    let headers = {
      'X-Kite-Version': '3',
      'Authorization': auth,
      "content-type": "application/json"
    }
  
    let allTrade = await DailyContestCompany.aggregate([
      {
        $lookup: {
          from: 'algo-tradings',
          localField: 'algoBox',
          foreignField: '_id',
          as: 'algo'
        }
      },
      {
        $match: {
          trade_time: {
            $gte: today
          },
          status: "COMPLETE",
          "algo.isDefault": true
        },
      },
      {
        $group: {
          _id: {
            symbol: "$symbol",
            product: "$Product",
            instrumentToken: "$instrumentToken",
            exchangeInstrumentToken: "$exchangeInstrumentToken",
            exchange: "$exchange",
            variety: "$variety",
            order_type: "$order_type",
            trader: "$trader"
          },
          lots: {
            $sum: {
              $toInt: "$Quantity",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          symbol: "$_id.symbol",
          product: "$_id.product",
          amount: 1,
          brokerage: 1,
          instrumentToken: "$_id.instrumentToken",
          exchangeInstrumentToken: "$_id.exchangeInstrumentToken",
          lots: 1,
          exchange: "$_id.exchange",
          variety: "$_id.variety",
          order_type: "$_id.order_type",
          trader: "$_id.trader"
        },
      },
    ])
  
    let mapForParticularUser = new Map();
  
    for(let i = 0; i < allTrade.length; i++){
      let buyOrSell = allTrade[i].lots > 0 ? "BUY" : "SELL";
  
      if(mapForParticularUser.has(allTrade[i].symbol)){
        let obj = mapForParticularUser.get(allTrade[i].symbol)
        obj.noOfTrader += 1
        obj.quantity += allTrade[i].lots
      } else{
        mapForParticularUser.set(allTrade[i].symbol, {
  
          exchange: allTrade[i].exchange,
          symbol: allTrade[i].symbol,
          transaction_type: buyOrSell,
          variety: allTrade[i].variety,
          product: allTrade[i].product,
          order_type: allTrade[i].order_type,
          lots: allTrade[i].lots,
          noOfTrader: 1
        }) 
      }
  
    }
  
    let finalArr = [];
    for (let value of mapForParticularUser.values()){
      finalArr.push(value);
    }
  
    // console.log(finalArr)
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let tradeData = [];
    let time = new Date();
    async function processPnlLiveDetails() {
      for (let i = 0; i < finalArr.length; i++) {
        
        if (finalArr[i].lots !== 0) {
          let buyOrSell = finalArr[i].lots > 0 ? "BUY" : "SELL";
          let orderData = [{
            "exchange": finalArr[i].exchange,
            "tradingsymbol": finalArr[i].symbol,
            "transaction_type": buyOrSell,
            "variety": finalArr[i].variety,
            "product": finalArr[i].product,
            "order_type": finalArr[i].order_type,
            "quantity": Math.abs(finalArr[i].lots),
            "price": 0,
            "trigger_price": 0
          }];
  
          // console.log("orderData", orderData);
          let marginData;
          let zerodhaMargin;
  
          try {
            marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, { headers: headers });
            liveData = await singleLivePrice(finalArr[i].exchange, finalArr[i].symbol)
            // console.log(liveData)
            zerodhaMargin = marginData.data.data.orders[0].total;
            // total += zerodhaMargin;
            // console.log(zerodhaMargin);
            tradeData.push({
              instrument: finalArr[i].symbol,
              marginRequired: zerodhaMargin,
              timestamp: time,
              runningLots: finalArr[i].lots,
              transaction_type: buyOrSell,
              noOfTrader: finalArr[i].noOfTrader,
              ltp: liveData?.last_price,
            })
            // console.log(total, marginData.data.data.orders[0]);
          } catch (e) {
            console.log("error fetching zerodha margin", e);
          }
        }
  
        await delay(300); // Introduce a delay of 300 ms
      }
    }
  
    await processPnlLiveDetails();
  
    try{
      const saveMock = await SaveDailyContestMock.create(tradeData)
      // console.log(saveMock);
    } catch(err){
      console.log("saving margin used mock", err);
    }
    // console.log(tradeData)
  })
}

exports.saveXtsMargin = async ()=>{
  const accessToken = await RequestToken.find({ status: "Active", accountType: xtsAccountType, xtsType: "Interactive" });

  let url = `${process.env.INTERACTIVE_URL}/interactive/user/balance?clientID=${process.env.XTS_CLIENTID}`;
  let token = accessToken[0]?.accessToken;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  let allTrade = await InfinityLiveCompany.aggregate([
    {
      $match: {
        trade_time: {
          $gte: today,
        },
      },
    },
    {
      $group:
        {
          _id: {
            trader: "$trader",
          },
          lots: {
            $sum: "$Quantity",
          },
        },
    },
    {
      $match:
        {
          lots: {
            $ne: 0,
          },
        },
    },
    {
      $group:
        {
          _id: {},
          noOfTrader: {
            $sum: 1,
          },
        },
    },
    {
      $project:
        {
          noOfTrader: 1,
          _id: 0,
        },
    },
  ])

  let authOptions = {
    headers: {
      Authorization: token,
    },
  };

  // console.log("allTrade", allTrade)
  if(allTrade[0]?.noOfTrader > 0){
    try {
      const response = await axios.get(url, authOptions)
      let position = response.data?.result?.BalanceList[0]?.limitObject?.RMSSubLimits?.marginUtilized;
  
      let data = {
        marginRequired: Number(position),
        timestamp: new Date(),
        noOfTrader: allTrade[0]?.noOfTrader,
      }
      const saveMock = await SaveXTSLive.create(data)
  
    } catch (err) {
      console.log(err)
    }
  }
}

exports.companyMarginTodayMock = async (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await InfinityMarginCompanyMock.countDocuments({ date: { $gte: today } })

  try{
    let x = await InfinityMarginCompanyMock.aggregate([
      { $match: {date: { $gte: today } } },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        }
      },
      {
        $project: {
          "avg_price":1, "order_id": 1, "instrument": 1, "quantity": 1, "transaction_type": 1, "type": 1, "parent_id": 1,
          "date": 1, "open_lots": 1, "margin_released": 1, "amount": 1, "margin_utilize": 1,
          "createdBy": {
            $concat: [{
              $arrayElemAt: ["$user.first_name", 0],
            }, " ", {
              $arrayElemAt: ["$user.last_name", 0],
            }]
          },
        }
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
   
    res.status(200).json({ status: 'success', data: x, count: count });

  }catch(e){
    console.log(e);
  }
}

exports.traderMarginTodayMock = async (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await InfinityMarginTraderMock.countDocuments({ date: { $gte: today } })

  try{
    let x = await InfinityMarginTraderMock.aggregate([
      { $match: {date: { $gte: today } } },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        }
      },
      {
        $project: {
          "avg_price":1, "order_id": 1, "instrument": 1, "quantity": 1, "transaction_type": 1, "type": 1, "parent_id": 1,
          "date": 1, "open_lots": 1, "margin_released": 1, "amount": 1, "margin_utilize": 1,
          "createdBy": {
            $concat: [{
              $arrayElemAt: ["$user.first_name", 0],
            }, " ", {
              $arrayElemAt: ["$user.last_name", 0],
            }]
          },
        }
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
   
    res.status(200).json({ status: 'success', data: x, count: count });

  }catch(e){
    console.log(e);
  }
}

exports.compnayMarginHistoryMock = async (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await InfinityMarginCompanyMock.countDocuments({ date: { $lt: today } })

  try{
    let x = await InfinityMarginCompanyMock.aggregate([
      { $match: {date: { $lt: today } } },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          "avg_price":1, "order_id": 1, "instrument": 1, "quantity": 1, "transaction_type": 1, "type": 1, "parent_id": 1,
          "date": 1, "open_lots": 1, "margin_released": 1, "amount": 1, "margin_utilize": 1,
          "createdBy": {
            $concat: [{
              $arrayElemAt: ["$user.first_name", 0],
            }, " ", {
              $arrayElemAt: ["$user.last_name", 0],
            }]
          },
        }
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
   
    res.status(200).json({ status: 'success', data: x, count: count });

  }catch(e){
    console.log(e);
  }
}

exports.traderMarginHistoryMock = async (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await InfinityMarginTraderMock.countDocuments({ date: { $lt: today } })

  try{
    let x = await InfinityMarginTraderMock.aggregate([
      { $match: {date: { $lt: today } } },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        }
      },
      {
        $project: {
          "avg_price":1, "order_id": 1, "instrument": 1, "quantity": 1, "transaction_type": 1, "type": 1, "parent_id": 1,
          "date": 1, "open_lots": 1, "margin_released": 1, "amount": 1, "margin_utilize": 1,
          "createdBy": {
            $concat: [{
              $arrayElemAt: ["$user.first_name", 0],
            }, " ", {
              $arrayElemAt: ["$user.last_name", 0],
            }]
          },
        }
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
   
    res.status(200).json({ status: 'success', data: x, count: count });

  }catch(e){
    console.log(e);
  }

}

exports.companyMarginTodayLive = async (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await InfinityMarginCompanyLive.countDocuments({ date: { $gte: today } })

  try{
    let x = await InfinityMarginCompanyLive.aggregate([
      { $match: {date: { $gte: today } } },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        }
      },
      {
        $project: {
          "avg_price":1, "order_id": 1, "instrument": 1, "quantity": 1, "transaction_type": 1, "type": 1, "parent_id": 1,
          "date": 1, "open_lots": 1, "margin_released": 1, "amount": 1, "margin_utilize": 1,
          "createdBy": {
            $concat: [{
              $arrayElemAt: ["$user.first_name", 0],
            }, " ", {
              $arrayElemAt: ["$user.last_name", 0],
            }]
          },
        }
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
   
    res.status(200).json({ status: 'success', data: x, count: count });

  }catch(e){
    console.log(e);
  }
}

exports.traderMarginTodayLive = async (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await InfinityMarginTraderLive.countDocuments({ date: { $gte: today } })

  try{
    let x = await InfinityMarginTraderLive.aggregate([
      { $match: {date: { $gte: today } } },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        }
      },
      {
        $project: {
          "avg_price":1, "order_id": 1, "instrument": 1, "quantity": 1, "transaction_type": 1, "type": 1, "parent_id": 1,
          "date": 1, "open_lots": 1, "margin_released": 1, "amount": 1, "margin_utilize": 1,
          "createdBy": {
            $concat: [{
              $arrayElemAt: ["$user.first_name", 0],
            }, " ", {
              $arrayElemAt: ["$user.last_name", 0],
            }]
          },
        }
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
   
    res.status(200).json({ status: 'success', data: x, count: count });

  }catch(e){
    console.log(e);
  }
}

exports.compnayMarginHistoryLive = async (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10

  const count = await InfinityMarginCompanyLive.countDocuments({ date: { $lt: today } })

  try {
    let x = await InfinityMarginCompanyLive.aggregate([
      { $match: { date: { $lt: today } } },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        }
      },
      {
        $project: {
          "avg_price":1, "order_id": 1, "instrument": 1, "quantity": 1, "transaction_type": 1, "type": 1, "parent_id": 1,
          "date": 1, "open_lots": 1, "margin_released": 1, "amount": 1, "margin_utilize": 1,
          "createdBy": {
            $concat: [{
              $arrayElemAt: ["$user.first_name", 0],
            }, " ", {
              $arrayElemAt: ["$user.last_name", 0],
            }]
          },
        }
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
    res.status(200).json({ status: 'success', data: x, count: count });


  } catch (e) {
    console.log(e);
  }
}

exports.traderMarginHistoryLive = async (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await InfinityMarginTraderLive.countDocuments({ date: { $lt: today } })

  try{
    let x = await InfinityMarginTraderLive.aggregate([
      { $match: {date: { $lt: today } } },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        }
      },
      {
        $project: {
          "avg_price":1, "order_id": 1, "instrument": 1, "quantity": 1, "transaction_type": 1, "type": 1, "parent_id": 1,
          "date": 1, "open_lots": 1, "margin_released": 1, "amount": 1, "margin_utilize": 1,
          "createdBy": {
            $concat: [{
              $arrayElemAt: ["$user.first_name", 0],
            }, " ", {
              $arrayElemAt: ["$user.last_name", 0],
            }]
          },
        }
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
   
    res.status(200).json({ status: 'success', data: x, count: count });

  }catch(e){
    console.log(e);
  }

}

exports.traderMarginHistoryLive = async (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await InfinityMarginTraderLive.countDocuments({ date: { $lt: today } })

  try{
    let x = await InfinityMarginTraderLive.aggregate([
      { $match: {date: { $lt: today } } },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        }
      },
      {
        $project: {
          "avg_price":1, "order_id": 1, "instrument": 1, "quantity": 1, "transaction_type": 1, "type": 1, "parent_id": 1,
          "date": 1, "open_lots": 1, "margin_released": 1, "amount": 1, "margin_utilize": 1,
          "createdBy": {
            $concat: [{
              $arrayElemAt: ["$user.first_name", 0],
            }, " ", {
              $arrayElemAt: ["$user.last_name", 0],
            }]
          },
        }
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
   
    res.status(200).json({ status: 'success', data: x, count: count });

  }catch(e){
    console.log(e);
  }

}

exports.marginRequiredForTrade = async (req, res)=>{
  const data = await getKiteCred.getAccess();
  const { exchange, symbol, buyOrSell, variety, Product, order_type, Quantity, price, last_price} = req.body;

  // console.log(req.body)
  let auth = 'token ' + data.getApiKey + ':' + data.getAccessToken;
  let headers = {
      'X-Kite-Version': '3',
      'Authorization': auth,
      "content-type": "application/json"
  }
  let orderData = [{
      "exchange": exchange,
      "tradingsymbol": symbol,
      "transaction_type": buyOrSell,
      "variety": variety,
      "product": Product,
      "order_type": order_type,
      "quantity": Quantity,
      "price": price ? Number(price) : 0,
      "trigger_price": 0
  }]

  let margin ;
  try{
      if(buyOrSell === "SELL"){
          const marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, { headers: headers })
          const zerodhaMargin = marginData.data.data.orders[0].total;

          margin = zerodhaMargin.toFixed(2);
      } else{
        if(order_type === "LIMIT"){
          margin = (price * Math.abs(Quantity)).toFixed(2);
        } else{
          margin = (last_price * Math.abs(Quantity)).toFixed(2);
        }
      }

      return res.status(200).json({ status: 'success', margin: Number(margin) ? Number(margin) : null });
  }catch(err){
      console.log(err);
  }
}
