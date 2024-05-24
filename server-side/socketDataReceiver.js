let { client7 } = require("./marketData/redisClient");
const { getIOValue } = require('./marketData/socketio');


client7.connect()
.then(async (res) => {
    
    console.log("redis connected of client3", res)
})
.catch((err) => {
    console.log("redis not connected", err)
})

exports.SocketDataReceiver = async () => {
    try{
        console.log("SocketDataReceiver is runninig")
        const io = getIOValue();
        await client7.SUBSCRIBE("data-receive", async (data) => {
    
            data = JSON.parse(data);
            io?.emit(`influencer-user:${data?.id}`, {
                status: data?.status, 
                data: data?.data,

                influencerUser: data?.influencerUser,
                influencerRevenue: data?.influencerRevenue
            })
        })
    } catch(err){
        console.log(err);
    }
}