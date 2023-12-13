const { ObjectId } = require("mongodb");
const PendingOrder = require("../models/PendingOrder/pendingOrderSchema")
let { client } = require("../marketData/redisClient");
const {applyingSLSP} = require("../PlaceOrder/saveDataInDB/PendingOrderCondition/applyingSLSP")
const {virtualTrader, internTrader, tenxTrader, dailyContest, marginx} = require("../constant");

exports.myTodaysProcessedTrade = async (req, res, next) => {

    let {id, from} = req.params;
    // console.log(from)
    // from = from.includes("%20") ? from.split("%20")[0] + " " + from.split("%20")[1] : from;
    const userId = req.user._id;
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10
    let product_type;
    try {

      if(from === tenxTrader){
        product_type = "6517d3803aeb2bb27d650de0"
      } else if(from === marginx){
        product_type = "6517d40e3aeb2bb27d650de1"
      } else if(from === dailyContest){
        product_type = "6517d48d3aeb2bb27d650de5"
      } else if(from === internTrader){
        product_type = "6517d46e3aeb2bb27d650de3"
      } else if(from === virtualTrader){
        product_type = "65449ee06932ba3a403a681a"
      }

      console.log(from , tenxTrader, product_type, userId, id)

      const count = await PendingOrder.countDocuments({
        product_type: new ObjectId(
          product_type
        ),
        createdBy: new ObjectId(
          userId
        ),
        createdOn: {
          $gte: today,
        },
        status: {$ne: "Pending"},
        sub_product_id: new ObjectId(id)
      })

      const myTodaysTrade = await PendingOrder.aggregate([
        {
          $match: {
            product_type: new ObjectId(
              product_type
            ),
            createdBy: new ObjectId(
              userId
            ),
            createdOn: {
              $gte: today,
            },
            status: {$ne: "Pending"},
            sub_product_id: new ObjectId(id)
          },
        },
        {
          $project: {
            symbol: 1,
            _id: 1,
            buyOrSell: 1,
            Quantity: 1,
            execution_price: 1,
            price: 1,
            execution_time: 1,
            amount: {
              $multiply: [
                "$price",
                "$Quantity",
              ],
            },
            type: 1,
            status: 1,
            symbol: 1,
            time: "$createdOn",
          },
        },
        {
          $sort:
          {
            time: -1,
          },
        },
        {
          $skip: skip
        },
        {
          $limit: limit
        }
      ])
      res.status(200).json({ status: 'success', data: myTodaysTrade, count: count ? count : 0 });
    } catch (e) {
      console.log(e);
      res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
}

exports.myTodaysPendingTrade = async (req, res, next) => {

  let {id, from} = req.params;

  // from = from.includes("%20") && from.split("%20")[0] + " " + from.split("%20")[1]

  const userId = req.user._id;
  let date = new Date();
  let product_type;
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  try {

    if(from === tenxTrader){
      product_type = "6517d3803aeb2bb27d650de0"
    } else if(from === marginx){
      product_type = "6517d40e3aeb2bb27d650de1"
    } else if(from === dailyContest){
      product_type = "6517d48d3aeb2bb27d650de5"
    } else if(from === internTrader){
      product_type = "6517d46e3aeb2bb27d650de3"
    } else if(from === virtualTrader){
      product_type = "65449ee06932ba3a403a681a"
    }

    console.log(from, product_type)
    const count = await PendingOrder.countDocuments({
      product_type: new ObjectId(
        product_type
      ),
      createdBy: new ObjectId(
        userId
      ),
      createdOn: {
        $gte: today,
      },
      status: "Pending",
      sub_product_id: new ObjectId(id)
    })

    const myTodaysTrade = await PendingOrder.aggregate([
      {
        $match: {
          product_type: new ObjectId(
            product_type
          ),
          createdBy: new ObjectId(
            userId
          ),
          createdOn: {
            $gte: today,
          },
          status: "Pending",
          sub_product_id: new ObjectId(id)
        },
      },
      {
        $project: {
          symbol: 1,
          _id: 1,
          buyOrSell: 1,
          Quantity: 1,
          execution_price: 1,
          price: 1,
          execution_time: 1,
          amount: {
            $multiply: [
              "$price",
              "$Quantity",
            ],
          },
          type: 1,
          status: 1,
          symbol: 1,
          time: "$createdOn",
          instrumentToken: 1,
          exchangeInstrumentToken: 1
        },
      },
      {
        $sort:
        {
          time: -1,
        },
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ])

    const totalQuantity = await PendingOrder.aggregate([
      {
        $match: {
          product_type: new ObjectId(
            product_type
          ),
          createdBy: new ObjectId(
            userId
          ),
          createdOn: {
            $gte: today,
          },
          status: "Pending",
          sub_product_id: new ObjectId(id)
        },
      },
      {
        $group: {
          _id: {
            type: "$type"
          },
          totalQuantity: {
            $sum: "$Quantity", // Assuming "amount" is the field you want to sum
          },
        },
      },
      {
        $project: {
          type: "$_id.type",
          quantity: "$totalQuantity"
        }
      }
    ])

    res.status(200).json({ status: 'success', data: myTodaysTrade, count: count || 0 });

    // res.status(200).json({ status: 'success', data: myTodaysTrade, count: count || 0, quantity: totalQuantity[0] || {} });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

exports.cancelOrder = async (req, res, next) => {
  const { id, from } = req.params;

  let pnlData;

  try {
    const updatedOrder = await PendingOrder.findOne(
      { _id: new ObjectId(id) },
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (updatedOrder.status !== "Pending") {
      return res.status(404).json({ message: "Order not found" });
    }

    data = await client.get('stoploss-stopprofit');
    data = JSON.parse(data);
    console.log(data)
    let symbolArr = data[`${updatedOrder.instrumentToken}`];
    for(let i = 0; i < symbolArr.length; i++){
        if(symbolArr[i]?._id?.toString() === id.toString() && 
           symbolArr[i]?.createdBy?.toString() === updatedOrder.createdBy.toString())
        {
            updatedOrder.status = "Cancelled";
            updatedOrder.execution_time = new Date();
            updatedOrder.execution_price = 0;
            const doc = await updatedOrder.save({new: true});
            
            if(from === tenxTrader){
              pnlData = await client.get(`${symbolArr[i]?.createdBy?.toString()}${symbolArr[i]?.sub_product_id?.toString()}: overallpnlTenXTrader`)
            } else if(from === marginx){
              pnlData = await client.get(`${symbolArr[i]?.createdBy?.toString()}${symbolArr[i]?.sub_product_id?.toString()} overallpnlMarginX`)
            } else if(from === dailyContest){
              pnlData = await client.get(`${symbolArr[i]?.createdBy?.toString()}${symbolArr[i]?.sub_product_id?.toString()} overallpnlDailyContest`)
            } else if(from === internTrader){
              pnlData = await client.get(`${symbolArr[i]?.createdBy?.toString()}${symbolArr[i]?.sub_product_id?.toString()}: overallpnlIntern`)
            } else if(from === virtualTrader){
              pnlData = await client.get(`${symbolArr[i]?.createdBy?.toString()}: overallpnlPaperTrade`)
            }
            pnlData = JSON.parse(pnlData)
            for(let elem of pnlData){
              console.log("pnl dtata", elem, pnlData)
              const buyOrSell = elem.lots > 0 ? "BUY" : "SELL";
              if(elem._id.symbol === symbolArr[i]?.symbol && elem._id.isLimit && buyOrSell === symbolArr[i]?.buyOrSell){

                console.log("in if", elem)
                if(Math.abs(elem.lots) > Math.abs(symbolArr[i]?.Quantity)){
                  console.log("in if greater", elem)
                  elem.margin = elem.margin - (elem.margin * Math.abs(symbolArr[i]?.Quantity)/Math.abs(elem.lots));
                  elem.lots = Math.abs(elem.lots) - Math.abs(symbolArr[i]?.Quantity);
                  elem.lots = buyOrSell==="SELL" ? -elem.lots : elem.lots;
                  break;
                } else if(Math.abs(elem.lots) === Math.abs(symbolArr[i]?.Quantity)){
                  console.log("in if equal", elem)
                  elem.margin = 0;
                  elem.lots = Math.abs(elem.lots) - Math.abs(symbolArr[i]?.Quantity);
                  break;
                }
              }
            }

            if(from === tenxTrader){
              await client.set(`${symbolArr[i]?.createdBy?.toString()}${symbolArr[i]?.sub_product_id?.toString()}: overallpnlTenXTrader`, JSON.stringify(pnlData))
            } else if(from === marginx){
              await client.set(`${symbolArr[i]?.createdBy?.toString()}${symbolArr[i]?.sub_product_id?.toString()} overallpnlMarginX`, JSON.stringify(pnlData))
            } else if(from === dailyContest){
              await client.set(`${symbolArr[i]?.createdBy?.toString()}${symbolArr[i]?.sub_product_id?.toString()} overallpnlDailyContest`, JSON.stringify(pnlData))
            } else if(from === internTrader){
              await client.set(`${symbolArr[i]?.createdBy?.toString()}${symbolArr[i]?.sub_product_id?.toString()}: overallpnlIntern`, JSON.stringify(pnlData))
            } else if(from === virtualTrader){
              await client.set(`${symbolArr[i]?.createdBy?.toString()}: overallpnlPaperTrade`, JSON.stringify(pnlData))
            }
            // await client.set(`${symbolArr[i]?.createdBy?.toString()}${symbolArr[i]?.sub_product_id?.toString()}: overallpnlTenXTrader`, JSON.stringify(pnlData));
            symbolArr.splice(i, 1, {});
            await client.set('stoploss-stopprofit', JSON.stringify(data));
            break;
        }
    }

    return res.status(200).json({status: "Success", data: updatedOrder});
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message });
  }
};

exports.editPrice = async (req, res, next) => {
  const { id } = req.params;
  const{execution_price} = req.body;

  // console.log(id, execution_price)

  try {
    const updatedOrder = await PendingOrder.findOne(
      { _id: new ObjectId(id) },
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (updatedOrder.status !== "Pending") {
      return res.status(404).json({ message: "Order not found" });
    }

    data = await client.get('stoploss-stopprofit');
    data = JSON.parse(data);
    let symbolArr = data[`${updatedOrder.instrumentToken}`];
    for(let i = 0; i < symbolArr.length; i++){
        if(symbolArr[i]?._id?.toString() === id.toString() && 
           symbolArr[i]?.createdBy?.toString() === updatedOrder.createdBy.toString())
        {
            updatedOrder.price = execution_price;
            const doc = await updatedOrder.save({new: true});
            symbolArr[i].price = execution_price;
            await client.set('stoploss-stopprofit', JSON.stringify(data));

            break;
        }
    }

    return res.status(200).json({status: "Success", data: updatedOrder});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.modifyOrder = async (req, res, next) => {
  try{
    const {instrumentToken, symbol, from} = req.body;
    const userId = req.user._id
    console.log(req.body)
    data = await client.get('stoploss-stopprofit');
    data = JSON.parse(data);
    if (data && data[`${instrumentToken}`]) {
        let symbolArray = data[`${instrumentToken}`];
        let indicesToRemove = [];
        for(let i = symbolArray.length-1; i >= 0; i--){
            if(symbolArray[i]?.createdBy?.toString() === userId.toString() && symbolArray[i]?.symbol === symbol){
                // remove this element
                indicesToRemove.push(i);
                const update = await PendingOrder.updateOne({_id: new ObjectId(symbolArray[i]?._id)},{
                  $set: {
                    status: "Cancelled",
                    execution_price: 0
                  }
              })
            }
        }
  
        // Remove elements after the loop
        indicesToRemove.forEach(index => symbolArray.splice(index, 1, {}));
    }
  
    await client.set('stoploss-stopprofit', JSON.stringify(data));
    const result = await applyingSLSP(req, {}, null ,null, from);
  
    return res.status(200).json({status: "Success", message: `Your SL/SP-M order placed for ${req.body.symbol}`});
  
  } catch(err){
    console.log(err)
    return res.status(200).json({status: "Error", message: "Something went wrong."});

  }
};
