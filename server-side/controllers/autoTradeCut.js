const User = require("../models/User/userDetailSchema");
const Subscription = require("../models/TenXSubscription/TenXSubscriptionSchema");
const InfinityTrader = require("../models/mock-trade/infinityTrader");
const TenxTrader = require("../models/mock-trade/tenXTraderSchema");


const tenx = async()=>{
    const subscription = await Subscription.aggregate(
        [
            {
              $match:
                {
                  status: "COMPLETE",
                },
            },
            {
              $group:
                {
                  _id: {
                    userId: "$_id",
                    subscriptionId: "$subscriptionId",
                    exchange: "$exchange",
                    symbol: "$symbol",
                    instrumentToken: "$instrumentToken",
                    variety: "$variety",
                    validity: "$validity",
                    order_type: "$order_type",
                    Product: "$Product",
                  },
                  runningLots: {
                    $sum: "$Quantity",
                  },
                  takeTradeQuantity: {
                    $sum: {
                      $multiply: ["$Quantity", -1],
                    },
                  },
                },
            },
            {
              $project:
                {
                  _id: 0,
                  userId: "$_id.userId",
                  subscriptionId: "$_id.subscriptionId",
                  exchange: "$_id.exchange",
                  symbol: "$_id.symbol",
                  instrumentToken: "$_id.instrumentToken",
                  variety: "$_id.variety",
                  validity: "$_id.validity",
                  order_type: "$_id.order_type",
                  Product: "_id.Product",
                  runningLots: "$runningLots",
                  takeTradeQuantity: "$takeTradeQuantity",
                },
            },
          ]
    );
}