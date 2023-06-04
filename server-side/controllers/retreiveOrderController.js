const RetreiveOrder = require("../models/TradeDetails/retreiveOrder");

exports.getRetreiveOrder = async(req, res, next)=>{
    try{
        const order = await RetreiveOrder.find().select("order_id status average_price quantity product transaction_type orderUniqueIdentifier exchange_order_id order_timestamp variety placed_by")
        res.status(200).json({message: "data received", data: order});
    } catch(err){
        console.log(err);
    }

}

exports.getTodaysRetreiveOrder = async (req, res, next) => {
  
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10
    const count = await RetreiveOrder.countDocuments({order_timestamp: {$gte:today}})
    // console.log("Under today orders", today)
    try {
      const order = await RetreiveOrder.find({order_timestamp: {$gte:today}}).select("order_id status average_price quantity product transaction_type orderUniqueIdentifier exchange_order_id order_timestamp variety placed_by quantity")
        // .populate('trader','employeeid first_name last_name')
        .sort({_id: -1})
        .skip(skip)
        .limit(limit);
    //   console.log(order)
      res.status(200).json({status: 'success', data: order, count:count});
    } catch (e) {
      console.log(e);
      res.status(500).json({status:'error', message: 'Something went wrong'});
    }
}

exports.getAllRetreiveOrder = async(req, res, next)=>{
    console.log("Inside Internship all orders API")
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10
    const count = await RetreiveOrder.countDocuments()
    try{
        const order = await RetreiveOrder.find()
        // .populate('trader','employeeid first_name last_name')
        .sort({_id: -1})
        .skip(skip)
        .limit(limit);
        // console.log("All Internship Orders",order)
        res.status(201).json({status: 'success', data: order, count: count});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
};