const express = require("express");
const router = express.Router();
const axios = require('axios');
require("../db/conn");
const Account =  require('../models/Trading Account/accountSchema');
const RequestToken = require("../models/Trading Account/requestTokenSchema");
const TradableInstrument = require("../models/Instruments/tradableInstrumentsSchema");
const Setting = require("../models/settings/setting");
const {removeWatchlist} = require("../controllers/removeWatchlist");


exports.openPrice = async () => {

  // await removeWatchlist();
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  date.setDate(date.getDate() + 7);

  let fromLessThen = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;


  const apiKey = await Account.find({ status: "Active" });
  const accessToken = await RequestToken.find({ status: "Active" });
  let getApiKey, getAccessToken;
  for (let elem of accessToken) {
    for (let subElem of apiKey) {
      if (elem.accountId === subElem.accountId) {
        getAccessToken = elem.accessToken;
        getApiKey = subElem.apiKey
      }
    }
  }

  const tradable = await TradableInstrument.find({
    expiry: {
      $gte: todayDate,
      $lt: fromLessThen
    },
    status: "Active",
    name: { $in: ["BANKNIFTY", "NIFTY50"] }
  });

  const updated = await TradableInstrument.updateMany(
    { infinityVisibility: true },
    { $set: { infinityVisibility: false } }
  );

  const setting = await Setting.find();
  const price = setting[0].infinityPrice;

  console.log("price", price)
  let addUrl;
  tradable.forEach((elem, index) => {
    if (index === 0) {
      addUrl = ('i=' + elem.exchange + ':' + elem.tradingsymbol);
    } else {
      addUrl += ('&i=' + elem.exchange + ':' + elem.tradingsymbol);
    }
  });


  let url = `https://api.kite.trade/quote?${addUrl}`;
  const api_key = getApiKey;
  const access_token = getAccessToken;
  let auth = 'token' + api_key + ':' + access_token;

  let authOptions = {
    headers: {
      'X-Kite-Version': '3',
      Authorization: auth,
    },
  };
  // { open: 76.15, high: 123.65, low: 53.75, close: 102.8 }
  try {
    // console.log(url, authOptions)
    const response = await axios.get(url, authOptions);

    for (let instrument in response.data.data) {
      console.log(response.data.data[instrument].last_price, instrument);
      const symbol = instrument.split(":")
      if (response.data.data[instrument].last_price <= price) {
        const updated = await TradableInstrument.updateMany(
          { tradingsymbol: symbol[1] },
          { $set: { infinityVisibility: true } }
        );

        //   console.log(updated)
      }
    }

  } catch (err) {
    console.log(err)
  }

}



