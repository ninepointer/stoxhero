const moment = require("moment");
const ThirdPartyTrades = require("../models/mock-trade/thirdPartyTrades");
const User = require("../models/User/userDetailSchema");
const { ObjectId } = require("mongodb");
const multer = require("multer");
const sendMail = require("../utils/emailService");
const BrokerageDetail = require("../models/Trading Account/brokerageSchema");


exports.convertToTradingDataToGroup = async (data, userId, res, broker) => {

  try {
    if(broker === 'ZERODHA'){
      data = await dataFormation(data);
    }
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

      groupedData[groupKey].Quantity += Number(
        elem?.["Quantity"].replace(/,/g, "")
      );
      groupedData[groupKey].totalPrice += Number(
        elem?.["Price"].replace(/,/g, "")
      );
      groupedData[groupKey].amount +=
        Number(elem?.["Price"]) * Number(elem?.["Quantity"].replace(/,/g, ""));
      groupedData[groupKey].count += 1;
    });

    // Step 2: Converting the grouped data to the required format
    let brokerData;
    if(broker !== 'OTHER'){
      brokerData = await BrokerageDetail.find();
    }
    const tradeData = [];
    for (const key in groupedData) {
      const elem = groupedData[key];
      // const avgPrice = Number(elem.totalPrice / elem.count)
      const avgPrice = Math.round((elem.totalPrice / elem.count) * 100) / 100;
      let checkOption = false;
      let checkFuture = false;
      let checkStock = false;
      let segment;
      if (elem?.["Option Type"] == "CE" || elem?.["Option Type"] == "PE") {
        checkOption = true;
        segment = 'Option';
      }

      if (elem?.["Option Type"] == "FX") {
        checkFuture = true;
        segment = 'Option';
      }

      if (elem?.["Instrument Type"] === "EQ") {
        checkStock = true;
        segment = 'Equity';
      }

      let instrument;
      if (elem?.symbol) {
        instrument = elem?.symbol;
      } else {
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
          instrument = elem?.["Symbol"];
        }
      }

      let buyOrSell;
      let quantity = 0;
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

      let brokerage;
      if(brokerData){
        const product = elem?.product;
        brokerage = await getBrokerageData(broker, segment, product, buyOrSell, amount, brokerData);
      } else{
        brokerage = Math.abs(Number(amount) * 0.001)
      }

      const exchange = elem?.exchange || 'NSE';
      const trade_time = elem?.order_execution_time
       ? elem?.order_execution_time
       : moment(elem?.["Trade Date/Time"], "DD MMMM YYYY HH:mm:ss")
      //  : moment(elem?.["Trade Date/Time"], "DD MMMM YYYY HH:mm:ss")
      //  .add(5, "hours")
      //  .add(30, "minutes")
      //  .utc()
      //  .format()

      // console.log(elem, {
      //   order_id: elem["Trade Id"],
      //   status: "COMPLETE",
      //   average_price: avgPrice,
      //   Quantity: quantity,
      //   // expiry: elem?.["Expiry Date"],
      //   buyOrSell,
      //   exchange: exchange,
      //   symbol: instrument,
      //   amount: amount,
      //   brokerage: brokerage,
      //       //todo-vijay

      //   // trade_time: moment(elem?.["Trade Date/Time"], "DD MMMM YYYY HH:mm:ss"),
      //   trade_time: trade_time,
      //   account_number: elem?.["Account Number"],
      //   broker: broker,
      //   user_id: elem?.["User Id"],
      //   modify_date: trade_time
      // })

      tradeData.push({
        order_id: elem["Trade Id"],
        status: "COMPLETE",
        average_price: avgPrice,
        Quantity: quantity,
        // expiry: elem?.["Expiry Date"],
        buyOrSell,
        exchange: exchange,
        symbol: instrument,
        amount: amount,
        brokerage: brokerage,
            //todo-vijay

        // trade_time: moment(elem?.["Trade Date/Time"], "DD MMMM YYYY HH:mm:ss"),
        trade_time: trade_time,
        account_number: elem?.["Account Number"],
        broker: broker,
        cp_id: elem?.["CP ID"],
        ctcl_id: elem?.["CTCL ID"],
        user_id: elem?.["User Id"],
        modify_date: trade_time,
        trader: userId,
        createdOn: new Date(),
        createdBy: userId,
      });
    }

    console.log("case4");

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
      return "Data Exist";
    }

    await ThirdPartyTrades.create(tradeData);

    // Grouping the data
    const finalgroupedData = tradeData.reduce((acc, trade) => {
      // Extract the date part from trade_time
      const tradeDate = moment(trade.trade_time).format("YYYY-MM-DD");
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

    res.status(200).json({
      status: "success",
      data: "ok",
    });
    return finalgroupedData;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const dataFormation = async(data)=>{
  const equityTrades = data.filter(elem=>elem.segment==='EQ');
  equityTrades.sort((a, b) => {
    if (a?.["order_execution_time"] > b?.["order_execution_time"]) {
      return 1;
    }
    if (a?.["order_execution_time"] <= b?.["order_execution_time"]) {
      return -1;
    }
  });

  data.forEach((elem)=>{

    const instrument = elem?.['symbol'];
    const buyOrSell = elem?.['trade_type'];

    if(buyOrSell?.toUpperCase()==='BUY'){
      elem['Buy/Sell'] = 1;
    } else if(buyOrSell?.toUpperCase()==='SELL'){
      elem['Buy/Sell'] = 2;
    }

    const tradeTime = elem?.['order_execution_time'];
    elem['Trade Date/Time'] = tradeTime;
    elem["Modified Date/Time"] = tradeTime;

    const price = elem?.['price'];
    elem["Price"] = price;

    const quantity = elem?.['quantity'];
    elem['Quantity'] = quantity;

    if(instrument?.includes('CE')){
      elem["Option Type"] = "CE";
    } else if(instrument?.includes('PE')){
      elem["Option Type"] = "PE";
    } else if(instrument?.includes('FUT')){
      elem["Option Type"] = "FX";
    }

    const expiry = elem?.["expiry_date"];
    elem["Expiry Date"] = expiry;

    const order_id = elem["order_id"];
    elem["Trade Id"] = order_id;

    if(elem?.['segment'] === 'EQ'){
      elem["Instrument Type"] = 'EQ';
    }

    const user_id = 'StoxHero';
    elem['User Id'] = user_id;

    const trade_date = elem?.trade_date;

    if(elem.segment === 'EQ'){
      const reverseTransaction = buyOrSell?.toUpperCase()==='BUY' ? 'SELL' : 'BUY';
      const sumQuantity = equityTrades.reduce((total, subelem)=>{
        if(subelem.trade_type===reverseTransaction && subelem.symbol===instrument && new Date(subelem.order_execution_time) > new Date(tradeTime) && subelem.trade_date === trade_date)
        return total + subelem.quantity
      })

      if(sumQuantity === quantity){
        elem['product'] = 'Intraday';
      } else{
        elem['product'] = 'Delivery';
      }
    } else{
      elem['product'] = 'Intraday';
    }
  })

  return data;
}

exports.mailSender = async (userId) => {
  const user = await User.findById(new ObjectId(userId)).select(
    "email first_name"
  );
  await sendMail(
    user.email,
    "Chart Data Processing is Complete",
    `
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
};

exports.teamIndividualPerformance = async (startDate, endDate, userIds) => {
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
      $sort: {
        avgPnl: 1,
      },
    },
  ]);

  return performance;
};

exports.getPreviousLots = async (symbol, date) => {
  const data = await ThirdPartyTrades.find({
    symbol: symbol,
    trade_time: { $lt: new Date(date) },
  });
  const runningLots = data.reduce((total, acc) => {
    return total + acc.Quantity;
  }, 0);

  return runningLots || 0;
};

exports.createTradeDoc = async (symbol, date, price, lots, expiry) => {
  return {
    status: "COMPLETE",
    average_price: price,
    Quantity: lots,
    expiry: expiry,
    buyOrSell: lots > 0 ? "BUY" : "SELL",
    exchange: "NFO",
    symbol: symbol,
    amount: lots * price,
    brokerage: Math.abs(Number(lots * price) * 0.001),
    trade_time: `${date}T09:15:00.000+00:00`,
  };
};

const fnoBrokerage = async(totalAmount, buyBrokerData, sellBrokerData, buyOrSell)=>{
  if(buyOrSell === 'SELL'){
    let brokerage = Number(sellBrokerData.brokerageCharge);
    let exchangeCharge =
      totalAmount * (Number(sellBrokerData.exchangeCharge) / 100);
    let sebiCharges = totalAmount * (Number(sellBrokerData.sebiCharge) / 100);
    let gst =
      (brokerage + exchangeCharge + sebiCharges) *
      (Number(sellBrokerData.gst) / 100);
    let stampDuty = totalAmount * (Number(sellBrokerData.stampDuty) / 100);
    let sst = totalAmount * (Number(sellBrokerData.sst) / 100);
    let finalCharge =
      brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
  
    return finalCharge;
  }

  if(buyOrSell === 'BUY'){
    let brokerage = Number(buyBrokerData.brokerageCharge);
    let exchangeCharge =
      totalAmount * (Number(buyBrokerData.exchangeCharge) / 100);
    let sebiCharges = totalAmount * (Number(buyBrokerData.sebiCharge) / 100);
    let gst =
      (brokerage + exchangeCharge + sebiCharges) *
      (Number(buyBrokerData.gst) / 100);
    let stampDuty = totalAmount * (Number(buyBrokerData.stampDuty) / 100);
    let sst = totalAmount * (Number(buyBrokerData.sst) / 100);
    let finalCharge =
      brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
    return finalCharge;
  }
}

const equityBrokerage = async (amount, brokerData, buyOrSell, product) => {
  if (product === "Intraday" && buyOrSell === "BUY") {
    return buyBrokerage(amount, brokerData, true)
  } else if (product === "Intraday" && buyOrSell === "SELL") {
    return sellBrokerage(amount, brokerData, true)
  } else if (product === "Delivery" && buyOrSell === "BUY") {
    return buyBrokerage(amount, brokerData)
  } else if (product === "Delivery" && buyOrSell === "SELL") {
    return sellBrokerage(amount, brokerData)
  }
}

function buyBrokerage(totalAmount, buyBrokerData, checkMax) {
  let brokerage = totalAmount * Number(buyBrokerData.brokerageCharge)/100;
  if(checkMax) brokerage = Math.min(brokerage, buyBrokerData?.maxBrokerage);
  let exchangeCharge = totalAmount * (Number(buyBrokerData.exchangeCharge) / 100);
  let sebiCharges = totalAmount * (Number(buyBrokerData.sebiCharge) / 100);
  let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(buyBrokerData.gst) / 100);
  let stampDuty = totalAmount * (Number(buyBrokerData.stampDuty) / 100);
  let sst = totalAmount * (Number(buyBrokerData.sst) / 100);
  let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
  return finalCharge;
}

function sellBrokerage(totalAmount, sellBrokerData, checkMax) {
  let brokerage = totalAmount * Number(sellBrokerData.brokerageCharge)/100;
  if(checkMax) brokerage = Math.min(brokerage, sellBrokerData?.maxBrokerage);
  let exchangeCharge = totalAmount * (Number(sellBrokerData.exchangeCharge) / 100);
  let sebiCharges = totalAmount * (Number(sellBrokerData.sebiCharge) / 100);
  let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(sellBrokerData.gst) / 100);
  let stampDuty = totalAmount * (Number(sellBrokerData.stampDuty) / 100);
  let sst = totalAmount * (Number(sellBrokerData.sst) / 100);
  let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;

  return finalCharge
}

const getBrokerageData = async(broker, segment, product, newBuySell, amount, brokerData)=>{
  if(segment === 'Option'){
    product === 'Intraday';
  }
  const particularBrokerData = brokerData.filter((elem)=>{
    return (elem.accountType === broker) && (elem.type === segment) && (elem.product === product) && (elem.transaction === newBuySell);
  })

  if(segment === 'Option'){
    return fnoBrokerage(amount, particularBrokerData[0], particularBrokerData[0], newBuySell);
  }

  if(segment === 'Equity'){
    return equityBrokerage(amount, particularBrokerData[0], newBuySell, product)
  }
}

//product define krna h
