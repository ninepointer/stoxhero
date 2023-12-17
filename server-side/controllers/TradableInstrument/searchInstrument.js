// const axios = require('axios');
// const zlib = require('zlib');
// const csv = require('csv-parser');
const TradableInstrument = require("../../models/Instruments/tradableInstrumentsSchema")
const EquityInstrument = require("../../models/Instruments/equityStocks");
const { xtsAccountType, zerodhaAccountType } = require("../../constant");
//TODO toggle between 
const Setting = require("../../models/settings/setting");
const Role = require("../../models/User/everyoneRoleSchema");
const {infinityTrader} = require("../../constant")
const {client, getValue} = require("../../marketData/redisClient");


exports.search = async (searchString, res, req) => {
  let isRedisConnected = getValue();
  const setting  = await Setting.find().select('toggle');
  const page = parseInt(req.query.page);
  const size = parseInt(req.query.size);
  let {isNifty, isBankNifty, isFinNifty, dailyContest} = req.query;
  console.log(isNifty, isBankNifty, isFinNifty, dailyContest)

  let query = [];
  if(isNifty==="true"){
    query.push({ $and: [{ isNifty: true }, { name: 'NIFTY50' }] })
  }
  if(isBankNifty==="true"){
    query.push({ $and: [{ isBankNifty: true }, { name: 'BANKNIFTY' }] })
  }
  if(isFinNifty==="true"){
    query.push({ $and: [{ isFinNifty: true }, { name: 'FINNIFTY' }] })
  }
  // let isNifty, isBankNifty, isFinNifty;
  const {role} = req.user;
  let roleObj;

  if(isRedisConnected && await client.exists('role')){
    roleObj = await client.get('role');
    roleObj = JSON.parse(roleObj)
    let roleArr = roleObj.filter((elem)=>{
      return (elem._id).toString() == role.toString();
    })
  
    roleObj = roleArr[0];
  } else{
      roleObj = await Role.find()
      await client.set('role', JSON.stringify(roleObj));
      let roleArr = roleObj.filter((elem)=>{
        return (elem._id).toString() == role.toString();
      })
    
      roleObj = roleArr[0];
  }


  try {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    date.setDate(date.getDate() + 7);

    let fromLessThen = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    let data ;
    console.log(todayDate , fromLessThen, searchString)

    if(roleObj.roleName === infinityTrader){
      data = await TradableInstrument.find({
        $and: [
          {
            $or: [
              { tradingsymbol: { $regex: searchString, $options: 'i' } },
              { name: { $regex: searchString, $options: 'i' } },
              { exchange: { $regex: searchString, $options: 'i' } },
              { expiry: { $regex: searchString, $options: 'i' } },
            ]
          },
          {
            status: 'Active',
            // infinityVisibility: true,
            // tradingsymbol: { $regex: /^(NIFTY|BANK)/i }
          },
          {
            expiry: {
              $gte: todayDate, // expiry is greater than or equal to today's date
              $lte: fromLessThen
              // $gt: new Date(today.getFullYear(), today.getMonth(), today.getDate()) // expiry is greater than today's date
            }
          }
        ]
      })
        .sort({ expiry: 1 })
        .limit(size)
        .exec();

        // console.log("data", data)
    } else{

      if(dailyContest){
        data = await TradableInstrument.find({
          $and: [
            {
              $or: [
                { tradingsymbol: { $regex: searchString, $options: 'i' } },
                { name: { $regex: searchString, $options: 'i' } },
                { exchange: { $regex: searchString, $options: 'i' } },
                { expiry: { $regex: searchString, $options: 'i' } },
              ]
            },
            {
              status: 'Active'
            },
            {
              // accountType: accountType
            },
            {
              expiry: {
                $gte: todayDate, // expiry is greater than or equal to today's date
                $lte: fromLessThen
              }
            },
            {
              $or: query
            }
          ]
        })
          .sort({ expiry: 1 })
          .limit(size)
          .exec();
      } else{
        data = await TradableInstrument.find({
          $and: [
            {
              $or: [
                { tradingsymbol: { $regex: searchString, $options: 'i' } },
                { name: { $regex: searchString, $options: 'i' } },
                { exchange: { $regex: searchString, $options: 'i' } },
                { expiry: { $regex: searchString, $options: 'i' } },
              ]
            },
            {
              status: 'Active'
            },
            // {
            //   tradingsymbol: { $regex: /^(NIFTY|BANK)/i }
            // },
            {
              expiry: {
                $gte: todayDate, // expiry is greater than or equal to today's date
                $lte: fromLessThen
              }
            },
          ]
        })
          .sort({ expiry: 1 })
          .limit(size)
          .exec();
      }

    }


    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}

exports.equitySearch = async (searchString, res, req) => {
  // const size = parseInt(req.query.size);

  console.log(searchString)
  try {
    let data = await EquityInstrument.find({
      $and: [
        {
          $or: [
            { tradingsymbol: { $regex: searchString, $options: 'i' } },
            { name: { $regex: searchString, $options: 'i' } },
            // { exchange: { $regex: searchString, $options: 'i' } },
            // { expiry: { $regex: searchString, $options: 'i' } },
          ]
        },
        {
          status: 'Active',
          isEquity: true
        },
      ]
    })
    .sort({ expiry: 1 })
    // .limit(size)
    .exec();

    res.status(200).json({ status: "success", data: data, message: "List Received" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.equityInstrumentArray = [
  6401,
  3861249,
  40193,
  1510401,
  5436929,
  60417,
  579329,
  4268801,
  81153,
  4267265,
  2714625,
  1195009,
  140033,
  134657,
  177665,
  175361,
  5215745,
  225537,
  2800641,
  232961,
  261889,
  315393,
  1086465,
  1850625,
  119553,
  341249,
  348929,
  356865,
  345089,
  1270529,
  5573121,
  4774913,
  2863105,
  56321,
  408065,
  424961,
  1346049,
  3001089,
  511233,
  4561409,
  492033,
  2939649,
  519937,
  2815745,
  2977281,
  6054401,
  4598529,
  633601,
  3660545,
  2730497,
  3834113,
  738561,
  3930881,
  4600577,
  779521,
  5582849,
  1102337,
  884737,
  878593,
  857857,
  3465729,
  897537,
  2953217,
  895745,
  2952193,
  2889473,
  969473
]



