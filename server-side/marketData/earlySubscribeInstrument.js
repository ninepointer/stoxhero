const TradableInstrument = require("../models/Instruments/tradableInstrumentsSchema");
const StockIndex = require("../models/StockIndex/stockIndexSchema");
const axios = require("axios");
const singleLivePrice = require("./sigleLivePrice");
// const {subscribeTokens} = require("./kiteTicker");


const EarlySubscribedInstrument = async () => {
  // console.log("log")
  return new Promise(async (resolve, reject) => {
    try {
      let date = new Date();
      let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      date.setDate(date.getDate() + 7);
      let fromLessThen = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      const name = await TradableInstrument.aggregate([
        {
          $match:
          {
            expiry: {
              $gte: todayDate, // expiry is greater than or equal to today's date
              $lt: fromLessThen
            }
          },
        },
        {
          $group: {
            _id: { name: "$name", lotsize: "$lot_size" },
          },
        },
        {
          $project:
          {
            _id: 0,
            name: "$_id.name",
            lotsize: "$_id.lotsize",
          },
        },
      ])

      const update = await TradableInstrument.updateMany({}, { earlySubscription: false })
      // console.log("update", name, update)

      for (let i = 0; i < name.length; i++) {
        let indexName;
        if (name[i]?.name === "BANKNIFTY") {
          indexName = "NIFTY BANK";
        } else if (name[i]?.name === "NIFTY50") {
          indexName = "NIFTY 50";
        } else if (name[i]?.name === "FINNIFTY") {
          indexName = "NIFTY FIN SERVICE";
        }
        const liveData = await singleLivePrice("NSE", indexName);
        let ltp = liveData[0]?.last_price;

        console.log("last_price", ltp)
        const aboveDocs = await TradableInstrument.aggregate([
          {
            $match:
            {
              expiry: {
                $gte: todayDate, // expiry is greater than or equal to today's date
                $lt: fromLessThen
              },

              name: name[i]?.name,
            },
          },
          {
            $match:
            {
              strike: {
                $gte: ltp,
              },
            },
          },
          {
            $sort:
            {
              strike: 1,
            },
          },
          {
            $limit:
              60,
          },
        ])

        const belowDocs = await TradableInstrument.aggregate([
          {
            $match:
            {
              expiry: {
                $gte: todayDate, // expiry is greater than or equal to today's date
                $lt: fromLessThen
              },

              name: name[i]?.name,
            },
          },
          {
            $match:
            {
              strike: {
                $lte: ltp,
              },
            },
          },
          {
            $sort:
            {
              strike: -1,
            },
          },
          {
            $limit:
              60,
          },
        ])
        const belowDocsIds = belowDocs.map((doc) => doc._id);
        const aboveDocsIds = aboveDocs.map((doc) => doc._id);
        
        // Merge the IDs into a single array
        const ids = belowDocsIds.concat(aboveDocsIds);
        await TradableInstrument.updateMany(
          { _id: { $in: ids } },
          { $set: { earlySubscription: true } }
        );

        // console.log("doc", aboveDocs, belowDocs)
      }
      resolve(); // Resolve the promise when the function completes successfully
    } catch (error) {
      reject(error); // Reject the promise if an error occurs
    }
  });
}

const optionChain = async (req, res) => {
  const {index} = req.params;
  return new Promise(async (resolve, reject) => {
    try {
      let date = new Date();
      let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      date.setDate(date.getDate() + 7);
      let fromLessThen = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      // const name = await TradableInstrument.aggregate([
      //   {
      //     $match:
      //     {
      //       expiry: {
      //         $gte: todayDate, // expiry is greater than or equal to today's date
      //         $lt: fromLessThen
      //       }
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: { name: "$name", lotsize: "$lot_size" },
      //     },
      //   },
      //   {
      //     $project:
      //     {
      //       _id: 0,
      //       name: "$_id.name",
      //       lotsize: "$_id.lotsize",
      //     },
      //   },
      // ])

      // const update = await TradableInstrument.updateMany({}, { earlySubscription: false })
      // console.log("update", name, update)

      // for (let i = 0; i < name.length; i++) {
        let indexName;
        if (index === "BANKNIFTY") {
          indexName = "NIFTY BANK";
        } else if (index === "NIFTY50") {
          indexName = "NIFTY 50";
        } else if (index === "FINNIFTY") {
          indexName = "NIFTY FIN SERVICE";
        }
        const liveData = await singleLivePrice("NSE", indexName);
        let ltp = liveData[0]?.last_price;

        console.log("last_price", ltp)
        const aboveDocs = await TradableInstrument.aggregate([
          {
            $match:
            {
              expiry: {
                $gte: todayDate,
                $lt: fromLessThen
              },

              name: index,
            },
          },
          {
            $match:
            {
              strike: {
                $gte: ltp,
              },
            },
          },
          {
            $limit:
              40,
          },
          {
            $sort:
            {
              strike: -1,
            },
          },

        ])

        const belowDocs = await TradableInstrument.aggregate([
          {
            $match:
            {
              expiry: {
                $gte: todayDate, // expiry is greater than or equal to today's date
                $lt: fromLessThen
              },

              name: index,
            },
          },
          {
            $match:
            {
              strike: {
                $lte: ltp,
              },
            },
          },
          {
            $sort:
            {
              strike: -1,
            },
          },
          {
            $limit:
              40,
          },
        ])

        res.status(200).json({status: "success", aboveSpot: aboveDocs, belowSpot: belowDocs})

      resolve(); // Resolve the promise when the function completes successfully
    } catch (error) {
      reject(error); // Reject the promise if an error occurs
    }
  });
}

module.exports = {EarlySubscribedInstrument, optionChain}

/*
1. write function which subscribe instrument according spot price.
  1.1 identify nearest strike price of spot price
  1.2 (strike price) - 30*lotsize, (strike price) + 30*lotsize also a flag to be set true in tradable instruemnt
2. show list of 20-20 instrument in table
*/