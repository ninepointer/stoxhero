const axios = require('axios');
const Account =  require('../models/Trading Account/accountSchema');
const RequestToken = require("../models/Trading Account/requestTokenSchema");
const Instrument = require("../models/Instruments/instrumentSchema");
const InstrumentMapping = require("../models/AlgoBox/instrumentMappingSchema");
const StockIndex = require("../models/StockIndex/stockIndexSchema");
const ContestInstrument = require("../models/Instruments/contestInstrument");
const InfinityInstrument = require("../models/Instruments/infinityInstrument");
const {xtsAccountType, zerodhaAccountType} = require("../constant");


const fetchData = async () => {


  try{
    // const res = await axios.get(url, authOptions);
    // for (instrument in res.data.data) {
    //   arr.push(res.data.data[instrument].instrument_token);
    // }
    const infinityInstrument = await InfinityInstrument.find({status: "Active"});
    const resp = await Instrument.find({status: "Active"});
    const index = await StockIndex.find({status: "Active", accountType: zerodhaAccountType})
    const contest = await ContestInstrument.find({status: "Active"});
    // const resp2 = await InstrumentMapping.find({Status: "Active"})


    let tokens = [];
    resp.forEach((elem)=>{
      tokens.push(elem.instrumentToken);
    }) 
    index.forEach((elem)=>{
      tokens.push(elem.instrumentToken);
    }) 
    contest.forEach((elem)=>{
      tokens.push(elem.instrumentToken);
    }) 
    infinityInstrument.forEach((elem)=>{
      tokens.push(elem.instrumentToken);
    }) 
  
    // console.log(tokens", tokens);
    // console.log("arr", arr);

    return tokens

  //   return arr;

  } catch (err){
    return new Error(err);
  } 

};

module.exports = fetchData;