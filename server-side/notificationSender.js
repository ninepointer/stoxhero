let { client3 } = require("./marketData/redisClient");
const { getIOValue } = require('./marketData/socketio');


client3.connect()
.then(async (res) => {
    
    console.log("redis connected of client3", res)
})
.catch((err) => {
    console.log("redis not connected", err)
})

exports.notificationSender = async () => {
    try{
        console.log("notificationSender is runninig")
        const io = getIOValue();
        await client3.SUBSCRIBE("order-notification", async (message) => {
    
            message = JSON.parse(message);
            console.log("this is notification data", message.response)
            io?.emit(`sendOrderResponse${message.createdBy}`, {status: "Success", message: `${message.response}`, data: Math.random() * 1000000 })
        })
    } catch(err){
        console.log(err);
    }
}