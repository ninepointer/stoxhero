const { ObjectId } = require("mongodb");
const PendingOrder = require("../models/PendingOrder/pendingOrderSchema")
let { client2, client, getValue, clientForIORedis } = require("../marketData/redisClient");


exports.myTodaysTrade = async (req, res, next) => {

    let {id, from} = req.params;
  
    const userId = req.user._id;
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10
    let count;
    let myTodaysTrade = [];
    try {

        if (from === "TenX") {

          count = await PendingOrder.aggregate([
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
              },
            },
            {
              $lookup: {
                from: "tenx-trade-users",
                localField: "order_referance_id",
                foreignField: "_id",
                as: "result",
              },
            },
            {
              $unwind: {
                path: "$result",
              },
            },
            {
              $match: {
                "result.subscriptionId": new ObjectId(
                  id
                ),
              },
            },
            {
              $count:
                "count",
            },
          ])
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
              },
            },
            {
              $lookup: {
                from: "tenx-trade-users",
                localField: "order_referance_id",
                foreignField: "_id",
                as: "result",
              },
            },
            {
              $unwind: {
                path: "$result",
              },
            },
            {
              $match: {
                "result.subscriptionId": new ObjectId(
                  id
                ),
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
        res.status(200).json({ status: 'success', data: myTodaysTrade, count: count[0].count });
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

    data = await client.get('stoploss-stopprofit');
    data = JSON.parse(data);
    let symbolArr = data[`${updatedOrder.instrumentToken}`];
    for(let i = 0; i < symbolArr.length; i++){
        if(symbolArr[i].instrumentToken === updatedOrder.instrumentToken && 
           symbolArr[i].createdBy.toString() === updatedOrder.createdBy.toString() && 
           Math.abs(symbolArr[i].Quantity) === Math.abs(Number(updatedOrder.Quantity)) && 
           symbolArr[i].buyOrSell === updatedOrder.buyOrSell && symbolArr[i].type !== updatedOrder.type)
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
