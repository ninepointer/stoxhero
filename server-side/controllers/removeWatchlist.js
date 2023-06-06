const User = require("../models/User/userDetailSchema");
const {client, getValue} = require("../marketData/redisClient")


exports.removeWatchlist = async () => {

    const updateUser = await User.updateMany({isAlgoTrader: true}, { $unset: { "watchlistInstruments": "" } })
    const user = await User.find({isAlgoTrader: true});

    for(let i = 0; i < user.length; i++){
        // console.log(user[i]);
        if(await client.exists(`${user[i]._id.toString()}: infinityInstrument`)){
            console.log("in third if");
            // console.log(user[i]);
            const del = await client.del(`${user[i]._id.toString()}: infinityInstrument`)
            console.log(del)
        }
    }

}