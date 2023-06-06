const User = require("../models/User/userDetailSchema");
const {client} = require("../marketData/redisClient");


exports.deletePnlKey = async () => {
    const user = await User.find().select('_id');

    for(let i = 0; i < user.length; i++){
        console.log(user[i]);
        if(await client.exists(`${user[i]._id.toString()} overallpnl`)){
            console.log("in first if");
            await client.del(`${user[i]._id.toString()} overallpnl`)
        }
        if(await client.exists(`${user[i]._id.toString()}: overallpnlPaperTrade`)){
            console.log("in second if");
            console.log(user[i]);
            await client.del(`${user[i]._id.toString()}: overallpnlPaperTrade`)
        }
        if(await client.exists(`${user[i]._id.toString()}: instrument`)){
            console.log("in third if");
            console.log(user[i]);
            await client.del(`${user[i]._id.toString()}: instrument`)
        }
        if(await client.exists(`${user[i]._id.toString()}: infinityInstrument`)){
            console.log("in third if");
            console.log(user[i]);
            await client.del(`${user[i]._id.toString()}: infinityInstrument`)
        }
    }
}