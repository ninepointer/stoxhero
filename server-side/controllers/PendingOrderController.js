const { ObjectId } = require("mongodb");
const PendingOrder = require("../models/PendingOrder/pendingOrderSchema")
let { client } = require("../marketData/redisClient");
const {applyingSLSP} = require("../PlaceOrder/saveDataInDB/PendingOrderCondition/applyingSLSP")


exports.myTodaysProcessedTrade = async (req, res, next) => {

    let {id, from} = req.params;
  
    const userId = req.user._id;
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10
    let count = [];
    let myTodaysTrade = [];
    try {

        if (from === "TenX") {
          count = await PendingOrder.countDocuments({
            product_type: new ObjectId(
              "6517d3803aeb2bb27d650de0"
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

          console.log("count", count)

          myTodaysTrade = await PendingOrder.aggregate([
            {
              $match: {
                product_type: new ObjectId(
                  "6517d3803aeb2bb27d650de0"
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
                amount: {
                  $multiply: [
                    "$execution_price",
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
        }
        res.status(200).json({ status: 'success', data: myTodaysTrade, count: count ? count : 0 });
    } catch (e) {
        console.log(e);
        res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
}

exports.myTodaysPendingTrade = async (req, res, next) => {

  let {id, from} = req.params;

  const userId = req.user._id;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  let count = [];
  let myTodaysTrade = [];
  try {

      if (from === "TenX") {
        count = await PendingOrder.countDocuments({
          product_type: new ObjectId(
            "6517d3803aeb2bb27d650de0"
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

        myTodaysTrade = await PendingOrder.aggregate([
          {
            $match: {
              product_type: new ObjectId(
                "6517d3803aeb2bb27d650de0"
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
              amount: {
                $multiply: [
                  "$execution_price",
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
      }
      res.status(200).json({ status: 'success', data: myTodaysTrade, count: count ? count : 0 });
  } catch (e) {
      console.log(e);
      res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

exports.cancelOrder = async (req, res, next) => {
  const { id } = req.params;

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
        if(symbolArr[i]._id.toString() === id.toString() && 
           symbolArr[i].createdBy.toString() === updatedOrder.createdBy.toString())
        {
            updatedOrder.status = "Cancelled";
            const doc = await updatedOrder.save({new: true});
            symbolArr.splice(i, 1);
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
    console.log(req.body)
    const {instrumentToken, symbol} = req.body;
    const userId = req.user._id
    data = await client.get('stoploss-stopprofit');
    data = JSON.parse(data);
    console.log("1st")
    if (data && data[`${instrumentToken}`]) {
        let symbolArray = data[`${instrumentToken}`];
        let indicesToRemove = [];
        console.log("2st", symbolArray.length)
        for(let i = symbolArray.length-1; i >= 0; i--){
          console.log(symbolArray[i].createdBy.toString() , userId.toString() , symbolArray[i].symbol , symbol)
            if(symbolArray[i].createdBy.toString() === userId.toString() && symbolArray[i].symbol === symbol){
                // remove this element
                console.log("3st", symbolArray[i]._id)
                indicesToRemove.push(i);
                // const update = await PendingOrder.updateOne({_id: new ObjectId(symbolArray[i]._id), status: "Pending", symbol: symbolArray[i].symbol},{
                //     $set: {status: "Cancelled"}
                // })
                const update = await PendingOrder.updateOne({_id: new ObjectId(symbolArray[i]._id)},{
                  $set: {status: "Cancelled"}
              })
              //, status: "Pending", symbol: symbolArray[i].symbol

            }
        }
  
        console.log("4st")
        // Remove elements after the loop
        indicesToRemove.forEach(index => symbolArray.splice(index, 1));
    }
  
    console.log("5st")
    await client.set('stoploss-stopprofit', JSON.stringify(data));
    const result = await applyingSLSP(req, {}, undefined);
  
    console.log("result", result)
    return res.status(200).json({status: "Success", message: `Your SL/SP-M order placed for ${req.body.symbol}`});
  
  } catch(err){
    console.log(err)
    return res.status(200).json({status: "Error", message: "Something went wrong."});

  }
};
