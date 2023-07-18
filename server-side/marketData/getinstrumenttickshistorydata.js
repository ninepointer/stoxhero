const axios = require("axios")
const InstrumentTicksDataSchema = require("../models/InstrumentHistoricalData/InstrumentHistoricalData");
const express = require("express");
const router = express.Router();
const ActiveInstruments = require("../models/Instruments/instrumentSchema");
const HistoryData = require("../models/InstrumentHistoricalData/InstrumentHistoricalData");
const getKiteCred = require('../marketData/getKiteCred'); 
const nodemailer = require('nodemailer');
const dailyPnlDataController = require("../controllers/dailyPnlDataController")
const traderwiseDailyPnlController = require("../controllers/traderwiseDailyPnlController")
const DailyPNLData = require("../models/InstrumentHistoricalData/DailyPnlDataSchema")
const TraderDailyPnlData = require("../models/InstrumentHistoricalData/TraderDailyPnlDataSchema");
const dbBackup = require("../Backup/mongoDbBackUp")
const RetreiveOrder = require("../controllers/retreiveOrder")
const MockTradeDetails = require("../models/mock-trade/infinityTradeCompany");
const sendMail = require('../utils/emailService');


const getInstrumentTicksHistoryData = async () => {
  getKiteCred.getAccess().then(async (data)=>{
    console.log("in ticks")
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    let todayDate1 = todayDate + "T00:00:00.000Z";
    const matchingDate = new Date(todayDate1);

    let instrumentDetail = await MockTradeDetails.aggregate([
      {
        $match: {
                trade_time:{
                    $gte: matchingDate
                },
          status: "COMPLETE",
        },
      },
      {
        $group: {
          _id: {
            symbol: "$symbol",
            instrumentToken: "$instrumentToken",
            exchangeInstrumentToken: "$exchangeInstrumentToken",
          },
          
        },
      },
      
    ])

    for(let i = 0; i < instrumentDetail.length; i++){
      let {instrumentToken, symbol} = instrumentDetail[i]._id;

      const historyData = await HistoryData.find({instrumentToken: instrumentToken, timestamp: {$regex:todayDate}})
      console.log("above if")
      if(historyData.length === 0){
        console.log("in if")
        const api_key = data.getApiKey;
        const access_token = data.getAccessToken;
        let auth = 'token' + api_key + ':' + access_token;

        
        const url = `https://api.kite.trade/instruments/historical/${instrumentToken}/minute?from=${todayDate}+09:15:00&to=${todayDate}+15:30:00`;
        
    
        let authOptions = {
          headers: {
            'X-Kite-Version': '3',
            Authorization: auth,
          },
        };
    

        try{
          const response = await axios.get(url, authOptions);
          const instrumentticks = (response.data).data;
          console.log("instrumentticks", instrumentticks, response)
          let len = instrumentticks.candles.length;
          let instrumentticksdata;
          for(let j = len-1; j >= 0; j--){
            instrumentticksdata = JSON.parse(JSON.stringify(instrumentticks.candles[j]));
    
            let [timestamp, open, high, low, close, volume] = instrumentticksdata
            let runtime = new Date()
            let createdOn = `${String(runtime.getDate()).padStart(2, '0')}-${String(runtime.getMonth() + 1).padStart(2, '0')}-${(runtime.getFullYear())}`;
                
            const instrumentticks_data = (new InstrumentTicksDataSchema({timestamp, symbol, instrumentToken, open, high, low, close, volume, createdOn }))
            console.log("above instrumentticks_data")
            instrumentticks_data.save()
            .then(()=>{
              console.log("saving", symbol, open, instrumentticks_data)
            }).catch((err)=> {
              console.log(err)
                  mailSender("Fail to enter data")
              // res.status(500).json({error:"Failed to enter data"});
            })
          }

        } catch (err){
          console.log(err)
            return new Error(err);
        }
    
      } else{

        const historyDataforLen = await HistoryData.find({timestamp: {$regex:todayDate}})

        let length = historyDataforLen.length;
        let message = length + " data already present"
        mailSender(message)
      }
  
    } 
  });
};

function mailSender(length){
  // let transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //           user: 'vvv201214@gmail.com',   //put your mail here
  //           pass: process.env.PASSWORD              //password here
  //         }
  // });
  
  // const mailOptions = { 
  //               from: 'team@stoxhero.com',       // sender address
  //               to: 'vvv201214@gmail.com, prateek@ninepointer.com',        // reciever address 
  //               subject: `History Data cronjob records inserted : ${length}`,  
  //               html: '<p>CronJob is done for history data, please check database</p>'// plain text body
  // };

  // transporter.sendMail(mailOptions, function (err, info) {
  //   if(err) 
  //     console.log("err in sending mail");
  //   else
  //     console.log("mail sent");
  // });

  sendMail("vvv201214@gmail.com", 'History Data - StoxHero', `
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
  `);


}

const main = async ()=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  await getInstrumentTicksHistoryData();
  const historyDataforLen = await HistoryData.find({timestamp: {$regex: todayDate}});   
  let length = historyDataforLen.length;
  mailSender(length);
}

module.exports = main;


