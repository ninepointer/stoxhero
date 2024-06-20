const axios = require("axios");
const InstrumentTicksDataSchema = require("../models/InstrumentHistoricalData/InstrumentHistoricalData");
const express = require("express");
const getKiteCred = require("../marketData/getKiteCred");
const sendMail = require("../utils/emailService");
const moment = require("moment");
const TradableInstrument = require("../models/Instruments/allTradableInstrumentsSchema");
const TradableInstrumentList = require("../controllers/TradableInstrument/tradableInstrument");
const IndiaVix = require("../models/Instruments/indiaVix");

const getInstrumentTicksHistoryData = async (todaysDatePart) => {
  return new Promise(async (resolve, reject) => {
    console.log("aight we here");
    try {
      const kiteData = await getKiteCred.getAccess();
      const endOfMonth = moment()
        .add(3, "months")
        .subtract(5, "hours")
        .subtract(30, "minutes");

      const datePart = new Date(endOfMonth).toISOString()?.split("T")[0];
      console.log("datePart", datePart);

      const instrumentList = await TradableInstrument.find({
        status: "Active",
        expiry: { $lt: datePart },
      }).select("instrument_token exchange_token expiry tradingsymbol");

      for (const elem of instrumentList) {
        const { instrument_token, exchange_token, expiry, tradingsymbol } =
          elem;
        const candles = await fetchAndFormatData(
          kiteData,
          instrument_token,
          todaysDatePart
        );

        console.log(candles.length);
        if (candles.length) {
          const saveData = await InstrumentTicksDataSchema.create([
            {
              symbol: tradingsymbol,
              instrumentToken: instrument_token,
              exchangeToken: exchange_token,
              expiry: expiry,
              candles: candles,
              createdOn: new Date(),
            },
          ]);
        }
      }
      resolve();
    } catch (err) {
      console.log("in err history", err);
      reject(err);
    }
  });
};

const fetchAndFormatData = async (kiteData, instrumentToken, todayDate) => {
  const api_key = kiteData.getApiKey;
  const access_token = kiteData.getAccessToken;
  const auth = "token" + api_key + ":" + access_token;
  const url = `https://api.kite.trade/instruments/historical/${instrumentToken}/minute?from=${todayDate}+09:15:00&to=${todayDate}+15:30:00`;

  const authOptions = {
    headers: {
      "X-Kite-Version": "3",
      Authorization: auth,
    },
  };

  try {
    const response = await axios.get(url, authOptions);
    const instrumentticks = response.data.data;
    const len = instrumentticks.candles.length;
    const instrumentticksdata = [];
    for (const candle of instrumentticks.candles) {
      const [timestamp, open, high, low, close, volume] = candle;
      instrumentticksdata.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume,
      });
    }

    return instrumentticksdata;
  } catch (err) {
    // console.log(err)
    return false;
  }
};

const saveIndiaVix = async (todaysDatePart) => {
  const kiteData = await getKiteCred.getAccess();
  const api_key = kiteData.getApiKey;
  const access_token = kiteData.getAccessToken;
  const auth = "token" + api_key + ":" + access_token;
  const authOptions = {
    headers: {
      "X-Kite-Version": "3",
      Authorization: auth,
    },
  };

  const url = `https://api.kite.trade/instruments/historical/${"264969"}/minute?from=${todaysDatePart}+09:15:00&to=${todaysDatePart}+15:30:00`;
  // const urlForEnd = `https://api.kite.trade/instruments/historical/264969/day?from=${todaysDatePart}+09:15:00&to=${todaysDatePart}+15:30:00`;

  try {
    // if(urlForEnd){
    //   await vixHelper(urlForEnd, authOptions)
    // }
    await vixHelper(url, authOptions);
  } catch (err) {
    // console.log(err)
    return false;
  }
};

async function vixHelper(url, authOptions) {
  const response = await axios.get(url, authOptions);
  const instrumentticks = response.data.data;
  const len = instrumentticks.candles.length;
  const instrumentticksdata = [];
  for (const candle of instrumentticks.candles) {
    const [timestamp, open, high, low, close, volume] = candle;
    let newTime;
    const newTimestamp = new Date(timestamp);
    if (instrumentticks.candles?.length === 1) {
      newTime = new Date(moment(timestamp).add(15, "hours").add(30, "minutes"));
      instrumentticksdata.push({
        timestamp: newTime,
        open,
        high,
        low,
        close,
        volume,
        instrument_token: 264969,
        exchange_token: 264969,
        tradingsymbol: "INDIA VIX",
      });
    } else {
      instrumentticksdata.push({
        timestamp: newTimestamp,
        open,
        high,
        low,
        close,
        volume,
        instrument_token: 264969,
        exchange_token: 264969,
        tradingsymbol: "INDIA VIX",
      });
    }
  }

  const data = await IndiaVix.create(instrumentticksdata);
}

async function mailSender(length) {
  await sendMail(
    "vvv201214@gmail.com",
    "History Data - StoxHero",
    `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>History Data</title>
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
      <h1>History Data Inserted</h1>
      <p>History Data cronjob records inserted : ${length}</p>
      <p>CronJob is done for history data, please check database</p>
      <br/><br/>
      <p>Thanks,</p>
      <p>StoxHero Team</p>

      </div>
  </body>
  </html>
  `
  );
}

exports.main = async () => {
  const today = moment();
  const start = today
    .clone()
    .startOf("day")
    .subtract(5, "hours")
    .subtract(30, "minutes");
  const end = today
    .clone()
    .endOf("day")
    .subtract(5, "hours")
    .subtract(30, "minutes");

  console.log(" before first", new Date());
  // const todaysDatePart = new Date()?.toISOString()?.split("T")?.[0];
  const todaysDatePart = '2024-06-18';

  // const inactiveeq = await TradableInstrument.updateMany(
  //   {instrument_type: 'EQ'}
  // , [
  //   { $set: { status: 'Inactive' } },
  // ]);

  // const inactive = await TradableInstrument.updateMany({
  //   $and: [
  //     { expiry: { $ne: '' } },
  //     { expiry: { $lt: todaysDatePart } }
  //   ]
  // }
  // , [
  //   { $set: { status: 'Inactive' } },
  // ]);

  // console.log('first', new Date(), inactive, inactiveeq);

  // await TradableInstrumentList.allTradableInstrument();

  await getInstrumentTicksHistoryData(todaysDatePart);
  await saveIndiaVix(todaysDatePart);
  console.log("end", new Date());
  const historyDataforLen = await InstrumentTicksDataSchema.find({
    createdOn: { $gt: new Date(start), $lt: new Date(end) },
  });
  const length = historyDataforLen.length;
  await mailSender(length);
};
