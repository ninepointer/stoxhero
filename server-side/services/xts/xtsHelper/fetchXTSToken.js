const Instrument = require("../../../models/Instruments/instrumentSchema");
const StockIndex = require("../../../models/StockIndex/stockIndexSchema");
// const ContestInstrument = require("../../../models/Instruments/contestInstrument");
const {xtsAccountType} = require("../../../constant");
const InfinityInstrument = require("../../../models/Instruments/infinityInstrument");


const fetchXTSData = async () => {


  try{

    const resp = await Instrument.find({status: "Active"});
    const infinityInstrument = await InfinityInstrument.find({status: "Active"});
    const index = await StockIndex.find({status: "Active", accountType: xtsAccountType})
    // const contest = await ContestInstrument.find({status: "Active"}); , accountType: xtsAccountType
    // const resp2 = await InstrumentMapping.find({Status: "Active"})


    let tokens = [];
    resp.forEach((elem)=>{
      if(elem.exchangeInstrumentToken){
        tokens.push({
          exchangeSegment: elem.exchangeSegment,
          exchangeInstrumentID: elem.exchangeInstrumentToken,
        })
      }
    }) 

    infinityInstrument.forEach((elem)=>{
      if(elem.exchangeInstrumentToken){
        tokens.push({
          exchangeSegment: elem.exchangeSegment,
          exchangeInstrumentID: elem.exchangeInstrumentToken,
        })
      }
    }) 
    
    index.forEach((elem)=>{
      tokens.push({
        exchangeSegment: elem.exchangeSegment,
        exchangeInstrumentID: elem.instrumentToken,
      });
    }) 
    // contest.forEach((elem)=>{
    //   tokens.push(elem.instrumentToken);
    // }) 
  
    // console.log(tokens", tokens);
    // console.log("arr", arr);
    console.log(tokens)
    return tokens

  //   return arr;

  } catch (err){
    return new Error(err);
  } 

};

module.exports = fetchXTSData;