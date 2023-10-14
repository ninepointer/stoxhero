const { ObjectId } = require("mongodb");
const TenXTrader = require("../models/mock-trade/tenXTraderSchema");
const PendingOrder = require("../models/PendingOrder/pendingOrderSchema")

exports.myTodaysTrade = async (req, res, next) => {

    let {id, from} = req.params;
  
    const userId = req.user._id;
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10
    // console.log("Under my today orders", userId, today)
    let count;
    let myTodaysTrade;
    try {

        if(from === "TenX"){
            count = await PendingOrder.countDocuments({ product_type: new ObjectId("6517d3803aeb2bb27d650de0"), createdBy: userId, createdOn: { $gte: today } })
            myTodaysTrade = await PendingOrder.find({ product_type: new ObjectId("6517d3803aeb2bb27d650de0"), createdBy: userId, createdOn: { $gte: today } }, { 'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time_utc': 1, 'order_id': 1, 'subscriptionId': 1 }).populate('subscriptionId', 'plan_name')
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);
        }
        res.status(200).json({ status: 'success', data: myTodaysTrade, count: count });
    } catch (e) {
        console.log(e);
        res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
}