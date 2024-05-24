// const axios = require('axios');
// const Account =  require('../models/Trading Account/accountSchema');
// const RequestToken = require("../models/Trading Account/requestTokenSchema");
const Instrument = require("../models/Instruments/instrumentSchema");
const EquityInstrument = require("../models/Instruments/equityStocks");
const StockIndex = require("../models/StockIndex/stockIndexSchema");
const {xtsAccountType, zerodhaAccountType} = require("../constant");
const TradableInstrument = require("../models/Instruments/tradableInstrumentsSchema")

const fetchData = async () => {


  try{

    const equityInstrument = await EquityInstrument.find();
    const resp = await Instrument.find({status: "Active"});
    const index = await StockIndex.find({status: "Active", accountType: zerodhaAccountType})
    const tradableInstrument = await TradableInstrument.find({earlySubscription: true});

    let tokens = [];
    resp.forEach((elem)=>{
      tokens.push(elem.instrumentToken);
    }) 
    index.forEach((elem)=>{
      tokens.push(elem.instrumentToken);
    }) 
 
    tradableInstrument.forEach((elem)=>{
      tokens.push(elem.instrument_token);
    }) 
    equityInstrument.forEach((elem)=>{
      tokens.push(elem.instrument_token);
    }) 
  
    return tokens

  } catch (err){
    return new Error(err);
  } 

};

module.exports = fetchData;