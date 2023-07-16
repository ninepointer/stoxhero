const InstrumentPNL = require("../../models/instrumentPNLData/instrumentPNLData");
const InfinityTradeCompany = require("../../models/mock-trade/infinityTradeCompany")
const user = require("../../models/User/userDetailSchema")

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el) && obj[el] !== null && obj[el] !== undefined && obj[el] !== '') {
        newObj[el] = obj[el];
      }
    });
    return newObj;
};

// date = '2023-01-17'
async function instrumentpnlcreator(date){
    // console.log("PNL Date: ",date)
    const date1 = new Date(date)
    const date2 = new Date(date)
    date2.setDate(date2.getDate() + 1)
    const date3 = date + 'T' + '09:17:00+0530'
    // console.log("Dates:",date1,date2,date3)

    const pipeline = [
        {
          $match: {
            $and: [
              {
                trade_time: {
                  $gte: date1,
                },
              },
              {
                trade_time: {
                  $lt: date2,
                },
              },
            ],
            status: "COMPLETE",
          },
        },
        {
          $group: {
            _id: {
              symbol: "$symbol",
              trade_date: {
                $substr: ["$trade_time", 0, 10],
              },
            },
            grossPnl: {
              $sum: {
                $multiply: ["$amount", -1],
              },
            },
            brokerage: {
              $sum: "$brokerage",
            },
          },
        },
        {
          $addFields: {
            netPnl: {
              $subtract: ["$grossPnl", "$brokerage"],
            },
          },
        },
        {
          $lookup: {
            from: "instrument-ticks-histories",
            let: {
              trade_date: {
                $substr: ["$_id.trade_date", 0, 10],
              },
              symbol: "$_id.symbol",
            },
            pipeline: [
              {
                $addFields: {
                  formattedDate: {
                    $dateToString: {
                      format: "%Y-%m-%d",
                      date: {
                        $toDate: "$timestamp",
                      },
                    },
                  },
                },
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$symbol", "$$symbol"],
                      },
                      {
                        $eq: [
                          "$formattedDate",
                          "$$trade_date",
                        ],
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  symbol: 1,
                  timestamp: 1,
                  open: 1,
                  close: 1,
                  volume: 1,
                },
              },
            ],
            as: "instrumentDetails",
          },
        },
        {
          $addFields: {
            instrumentDetails: {
              $filter: {
                input: "$instrumentDetails",
                as: "item",
                cond: {
                  $eq: [
                    "$$item.timestamp",
                    date3,
                  ],
                },
              },
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            grossPnl: {
              $sum: "$grossPnl",
            },
            brokerage: {
              $sum: "$brokerage",
            },
            instrumentDetails: {
              $push: "$instrumentDetails",
            },
          },
        },
        {
          $addFields: {
            netPnl: {
              $subtract: ["$grossPnl", "$brokerage"],
            },
          },
        },
        {
          $project: {
            _id: 0,
            grossPnl: 1,
            brokerage: 1,
            netPnl: 1,
            date: "$_id.trade_date",
            symbol: "$_id.symbol",
            timestamp: {
              $let: {
                vars: {
                  details: {
                    $arrayElemAt: [
                      {
                        $arrayElemAt: [
                          "$instrumentDetails",
                          0,
                        ],
                      },
                      0,
                    ],
                  },
                },
                in: {
                  $ifNull: [
                    "$$details.timestamp",
                    null,
                  ],
                },
              },
            },
            open: {
              $let: {
                vars: {
                  details: {
                    $arrayElemAt: [
                      {
                        $arrayElemAt: [
                          "$instrumentDetails",
                          0,
                        ],
                      },
                      0,
                    ],
                  },
                },
                in: {
                  $ifNull: ["$$details.open", null],
                },
              },
            },
            volume: {
              $let: {
                vars: {
                  details: {
                    $arrayElemAt: [
                      {
                        $arrayElemAt: [
                          "$instrumentDetails",
                          0,
                        ],
                      },
                      0,
                    ],
                  },
                },
                in: {
                  $ifNull: ["$$details.volume", null],
                },
              },
            },
          },
        },
      ]

    const data = await InfinityTradeCompany.aggregate(pipeline)
    const instrumentdatacheck = await InstrumentPNL.find({date:date})
    // console.log("Data Length: ",instrumentdatacheck.length)
    if(instrumentdatacheck.length > 0){
        return;
    }
    else{
        // console.log("Generated Data :",data)
        await InstrumentPNL.create(data);
    }
    // console.log("Data generated for :",date)
    

}

exports.createInstrumentPNLData = async(req, res, next)=>{
    
    let {startDate,endDate} = req.params;
    //startDate = '2023-01-17'
    startDate = new Date(startDate)
    endDate = new Date(endDate)
    // console.log("Start & End Date: ",startDate,endDate)

    for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
        let newDate = new Date(currentDate).toISOString()
        // console.log("New Date & Current Date: ", newDate, currentDate)

        await instrumentpnlcreator(newDate.split('T')[0]);
        // console.log("Function called")

      }

}
