const User = require("../models/User/userDetailSchema");
const {client, getValue} = require('../marketData/redisClient');
const Instrument = require("../models/Instruments/instrumentSchema");

exports.removeInstrumentFromWatchlist = async () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
  
    console.log("removeInstrumentFromWatchlist")
    const instrument = await Instrument.find(
      { contractDate: { $lt: date }, status: "Active" },
    ).select('_id');
  
    if(instrument.length === 0){
      return;
    }
  
    const userWatchlist = await User.find({ 'watchlistInstruments': { $exists: true, $not: { $size: 0 } } }).select('watchlistInstruments');
  
    console.log("watchlist", userWatchlist.length)
    for (let i = 0; i < userWatchlist.length; i++) {
      const watchlistInstruments = userWatchlist[i].watchlistInstruments;
      const userId = userWatchlist[i]._id;
      // Iterate through the instrument array
      for (let j = 0; j < instrument.length; j++) {
        const instrumentId = instrument[j]._id;
  
        // Check if the instrumentId exists in the watchlistInstruments array
        const index = watchlistInstruments.indexOf(instrumentId);
        if (index !== -1) {
          // Remove the element from watchlistInstruments array
          watchlistInstruments.splice(index, 1);
        }
      }
  
      await client.del(`${userWatchlist[i]._id.toString()}: instrument`);
      const updateUserWatchlist = await User.findOneAndUpdate({_id: (userId)}, {
        $set: {
          watchlistInstruments: watchlistInstruments
        }
      })
      // await userWatchlist[i].save({validateBeforeSave: false});
      // console.log("check", updateUserWatchlist)
    }
  
    await Instrument.updateMany(
      { contractDate: { $lte: expiryDate }, status: "Active" },
      { $set: { status: "Inactive" } }
    )
}
