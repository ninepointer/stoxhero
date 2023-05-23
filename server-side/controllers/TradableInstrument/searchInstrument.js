// const axios = require('axios');
// const zlib = require('zlib');
// const csv = require('csv-parser');
const TradableInstrument = require("../../models/Instruments/tradableInstrumentsSchema")
// const getKiteCred = require('../../marketData/getKiteCred');
const { xtsAccountType, zerodhaAccountType } = require("../../constant");
//TODO toggle between 
const Setting = require("../../models/settings/setting");

exports.search = async (searchString, res, req) => {

  const setting  = await Setting.find().select('toggle');
  const page = parseInt(req.query.page);
  const size = parseInt(req.query.size);
  console.log(page, size, setting[0].toggle)

  let accountType ;
  if(setting[0]?.toggle?.ltp == zerodhaAccountType || setting[0]?.toggle?.complete == zerodhaAccountType){
    accountType = zerodhaAccountType;
  } else{
    accountType = xtsAccountType;
  }

  try {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    // let fromLessThen = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()+7).padStart(2, '0')}`
    date.setDate(date.getDate() + 7);

    let fromLessThen = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    console.log(todayDate, fromLessThen)
    const data = await TradableInstrument.find({
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
            $lt: fromLessThen
            // $gt: new Date(today.getFullYear(), today.getMonth(), today.getDate()) // expiry is greater than today's date
          }
        }
      ]
    })
      .sort({ expiry: 1 })
      .limit(size)
      .exec();

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}



