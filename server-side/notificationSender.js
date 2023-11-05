let { client3 } = require("./marketData/redisClient");
const { getIOValue } = require('./marketData/socketio');


client3.connect()
.then(async (res) => {
    
    console.log("redis connected", res)
})
.catch((err) => {
    console.log("redis not connected", err)
})

exports.notificationSender = async () => {
    const io = getIOValue();
    await client3.SUBSCRIBE("order-notification", async (message) => {

        message = JSON.parse(message);
        // console.log("this is notification data", message)
        io?.emit(`sendOrderResponse${message.createdBy}`, {status: "Success", message: `Your ${message.type==="StopLoss" ? "Stop Loss" : message.type==="StopProfit" ? "Stop Profit" : "Limit"} of ${message.symbol} has been executed at ₹${message.execution_price}.`, data: Math.random() * 1000000 })
    })
}