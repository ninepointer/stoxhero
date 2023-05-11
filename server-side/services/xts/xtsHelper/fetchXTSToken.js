const Instrument = require("../../../models/Instruments/instrumentSchema");
const StockIndex = require("../../../models/StockIndex/stockIndexSchema");
// const ContestInstrument = require("../../../models/Instruments/contestInstrument");
const {xtsAccountType} = require("../../../constant");


const fetchXTSData = async () => {


  try{

    const resp = await Instrument.find({status: "Active", accountType: xtsAccountType});
    const index = await StockIndex.find({status: "Active", accountType: xtsAccountType})
    // const contest = await ContestInstrument.find({status: "Active"});
    // const resp2 = await InstrumentMapping.find({Status: "Active"})


    let tokens = [];
    resp.forEach((elem)=>{
      tokens.push({
        exchangeSegment: elem.exchangeSegment,
        exchangeInstrumentID: elem.instrumentToken,
      })
    }) 
    // index.forEach((elem)=>{
    //   tokens.push({
    //     exchangeSegment: 1, //TODO change constant in client side
    //     exchangeInstrumentID: elem.instrumentToken,
    //   });
    // }) 
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