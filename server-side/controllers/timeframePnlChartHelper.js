const moment = require("moment");
const ThirdPartyTrades = require("../models/mock-trade/thirdPartyTrades");
const User = require('../models/User/userDetailSchema');
const { ObjectId } = require("mongodb");
const multer = require("multer");
const sendMail = require("../utils/emailService");



exports.convertToTradingDataToGroup = async (data, userId, res) => {
  console.log('case1')
  try {
    data.sort((a, b) => {
      if (a?.["Trade Date/Time"] > b?.["Trade Date/Time"]) {
        return 1;
      }
      if (a?.["Trade Date/Time"] <= b?.["Trade Date/Time"]) {
        return -1;
      }
    });
    // Step 1: Grouping the data
    const groupedData = {};
    console.log('case2')
    data.forEach((elem) => {
      const groupKey = [
        elem?.["Strike Price"],
        elem?.["Option Type"],
        elem?.["Symbol"],
        elem?.["Buy/Sell"],
        elem?.["Trade Date/Time"],
        elem?.["Contract Name"],
      ].join("|");
      
      if (!groupedData[groupKey]) {
        groupedData[groupKey] = {
          ...elem,
          Quantity: 0,
          totalPrice: 0,
          count: 0,
          amount: 0,
        };
      }

      groupedData[groupKey].Quantity += Number(elem?.["Quantity"].replace(/,/g, ''));
      groupedData[groupKey].totalPrice += Number(elem?.["Price"].replace(/,/g, ''));
      groupedData[groupKey].amount +=
        Number(elem?.["Price"]) * Number(elem?.["Quantity"].replace(/,/g, ''));
      groupedData[groupKey].count += 1;
    });

    // Step 2: Converting the grouped data to the required format
    const tradeData = [];
    for (const key in groupedData) {
      console.log('case3')
      const elem = groupedData[key];
      // const avgPrice = Number(elem.totalPrice / elem.count)
      const avgPrice = Math.round((elem.totalPrice / elem.count) * 100) / 100;
      let checkOption = false;
      let checkFuture = false;
      let checkStock = false;
      if (elem?.["Option Type"] == "CE" || elem?.["Option Type"] == "PE") {
        checkOption = true;
      }

      if (elem?.["Option Type"] == "FX") {
        checkFuture = true;
      }

      if (elem?.['Instrument Type'] === 'EQ') {
        checkStock = true;
      }

      let instrument;
      if (checkFuture) {
        const newExpiry = moment(elem?.["Expiry Date"], "DD MMMM YYYY")
          .clone()
          .format("DDMMMYY");
        instrument = `${elem?.["Symbol"]}${newExpiry?.toUpperCase()}FUT`;
      }
      if (checkOption) {
        const newExpiry = moment(elem?.["Expiry Date"], "DD MMMM YYYY")
          .clone()
          .format("DDMMMYY");
        instrument = `${elem?.["Symbol"]}${newExpiry?.toUpperCase()}${elem?.["Strike Price"]
          }${elem?.["Option Type"]}`;
      }

      if (checkStock) {
        instrument = elem?.["Symbol"]
      }

      let buyOrSell;
      let quantity=0;
      let amount = 0;
      if (elem?.["Buy/Sell"] === "2") {
        buyOrSell = "SELL";
        quantity = 0 - elem.Quantity;
        // amount = avgPrice * quantity;
        amount = 0 - elem?.amount;
      } else {
        buyOrSell = "BUY";
        quantity = elem.Quantity;
        // amount = avgPrice * quantity;
        amount = elem?.amount;
      }

      // console.log(quantity, amount, moment(elem?.['Trade Date/Time'], "DD MMMM YYYY HH:mm:ss").add(5, 'hours').add(30, 'minutes').utc().format())
      tradeData.push({
        order_id: elem["Trade Id"],
        status: "COMPLETE",
        average_price: avgPrice,
        Quantity: quantity,
        // expiry: elem?.["Expiry Date"],
        buyOrSell,
        exchange: "NFO",
        symbol: instrument,
        amount: amount,
        brokerage: Math.abs(Number(amount)*0.001),
        //todo-vijay
        trade_time: moment(elem?.["Trade Date/Time"], "DD MMMM YYYY HH:mm:ss"),
        // trade_time: moment(elem?.['Trade Date/Time'], "DD MMMM YYYY HH:mm:ss").add(5, 'hours').add(30, 'minutes').utc().format(),
        account_number: elem?.["Account Number"],
        cp_id: elem?.["CP ID"],
        ctcl_id: elem?.["CTCL ID"],
        user_id: elem?.["User Id"],
        modify_date: moment(elem?.["Modified Date/Time"], "DD MMMM YYYY HH:mm:ss"),
        trader: userId,
        createdOn: new Date(),
        createdBy: userId,
      });
    }


    console.log('case4')

    const getStartDate = moment(tradeData?.[0]?.trade_time)
      .startOf("day")
      .add(5, "hours")
      .add(30, "minutes");
    const getEndDate = moment(tradeData?.[0]?.trade_time)
      .endOf("day")
      .add(5, "hours")
      .add(30, "minutes");

    const checkExist = await ThirdPartyTrades.findOne({
      trader: new ObjectId(userId),
      order_id: tradeData?.[0]?.order_id,
      trade_time: { $gt: new Date(getStartDate), $lt: new Date(getEndDate) },
    });

    if (checkExist) {
      res.status(400).json({
        status: "error",
        message: "Uploaded data already exist!",
      });
      return 'Data Exist';
    }

    await ThirdPartyTrades.create(tradeData);

    // Grouping the data
    const finalgroupedData = tradeData.reduce((acc, trade) => {
      // Extract the date part from trade_time
      const tradeDate = moment(trade.trade_time).format('YYYY-MM-DD');
      console.log('case5')
      // Create a key using symbol and tradeDate
      const key = `${trade.symbol}_${tradeDate}`;

      // If the key doesn't exist in the accumulator, initialize it with an empty array
      if (!acc[key]) {
        acc[key] = [];
      }

      // Push the current trade to the appropriate group
      acc[key].push(trade);

      return acc;
    }, {});

    console.log('case6')
    res.status(200).json({
      status: "success",
      data: "ok",
    });
    return (finalgroupedData);

  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

exports.mailSender = async(userId) => {
  const user = await User.findById(new ObjectId(userId))
  .select('email first_name');
  await sendMail(user.email, 'Chart Data Processing is Complete', `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Your Chart Data Processing is Complete</title>
      <style>
      body {
          font-family: cambria, sans-serif;
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
      <p>Dear ${user?.first_name},</p>
      <p>
We are pleased to inform you that the processing of your data has been successfully completed.</p>
      <p>If you have any questions or require further information, please do not hesitate to reach out to our support team.</p>
      <br/><br/>
      <p>Thank you for your patience and cooperation.</p>
      <p>StoxHero Team</p>

      </div>
  </body>
  </html>
  `
  );
}

exports.teamIndividualPerformance = async(startDate, endDate, userIds)=>{
  const performance = await ThirdPartyTrades.aggregate([
    {
      $match: {
        trade_time: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        status: "COMPLETE",
        trader: {
          $in: userIds,
        },
      },
    },
    {
      $group: {
        _id: {
          trader: "$trader",
        },
        amount: {
          $sum: {
            $multiply: ["$amount", -1],
          },
        },
        brokerage: {
          $sum: {
            $toDouble: "$brokerage",
          },
        },
        trades: {
          $count: {},
        },
        tradingDays: {
          $addToSet: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$trade_time",
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: "user-personal-details",
        localField: "_id.trader",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $project: {
        _id: 0,
        grossPnl: "$amount",
        brokerage: "$brokerage",
        _id: 0,
        npnl: {
          $subtract: ["$amount", "$brokerage"],
        },
        tradingDays: {
          $size: "$tradingDays",
        },
        trades: 1,
        first_name: {
          $arrayElemAt: ["$user.first_name", 0],
        },
        last_name: {
          $arrayElemAt: ["$user.last_name", 0],
        },
        avgPnl: {
          $divide: [
            {
              $subtract: ["$amount", "$brokerage"],
            },
            {
              $size: "$tradingDays",
            },
          ],
        },
        avgBrokerage: {
          $divide: [
            "$brokerage",
            {
              $size: "$tradingDays",
            },
          ],
        },
        avgTrade: {
          $divide: [
            "$trades",
            {
              $size: "$tradingDays",
            },
          ],
        },
      },
    },
    {
      $sort:
        {
          avgPnl: 1,
        },
    },
  ])

  return performance;
}

exports.getPreviousLots = async(symbol, date)=>{
  const data = await ThirdPartyTrades.find({symbol: symbol, trade_time: {$lt: new Date(date)}});
  const runningLots = data.reduce((total, acc)=>{
    return total + acc.Quantity;
  }, 0);

  return runningLots || 0;
}

exports.createTradeDoc = async(symbol, date, price, lots, expiry)=>{
  return {
    status: "COMPLETE",
    average_price: price,
    Quantity: lots,
    expiry: expiry,
    buyOrSell: lots>0 ? 'BUY' : 'SELL',
    exchange: "NFO",
    symbol: symbol,
    amount: (lots*price),
    brokerage: Math.abs(Number(lots*price)*0.001),
    trade_time: `${date}T09:15:00.000+00:00`,
  }
}

/*
0. add expiry in trade documents

1. check previous open lots for that symbol in database, 
if found then create an trade in trade array

2. for creating trade i need last price of that symbol on current date

3. also calculate trade array's remaining open lots and update that
object , if trade document's trade_time and expiry's date is same then 
lots for that symbol is 0

do the above steps in saveDataToDB function

1. exipry wala added nhi h
2. trades wala tbhi extend ho if previous lots > 0
3. 3 no. is pending
*/