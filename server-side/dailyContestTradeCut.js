const DailyContest = require('./models/DailyContest/dailyContest'); // Assuming your model is exported as Contest from the mentioned path
const {client} = require("./marketData/redisClient");
const {dailyContestSingleMockMod} = require("./controllers/AutoTradeCut/collectingTradeManually")
const ObjectId = require('mongodb').ObjectId;

exports.dailyContestTradeCut = async()=>{
    let data = await client.get('dailyContestTime');
    data = JSON.parse(data);
    for(let elem of data){
        if(new Date(elem.endTime) <= new Date() && elem.status === "Active"){

            const dd = await dailyContestSingleMockMod(elem?._id);
            await DailyContest.findOneAndUpdate({_id: new ObjectId(elem?._id)}, {
                $set: {
                    contestStatus: "Completed"
                }
            })
            elem.status = "Completed";
            await client.set('dailyContestTime', JSON.stringify(data));

            // return;
        }
    }
}

exports.dailyContestTimeStore = async()=>{
    const dailyContest = await DailyContest.find({contestStatus: "Active"});
    const arr = [];
    for(let elem of dailyContest){
        arr.push({_id: elem?._id, endTime: elem?.contestEndTime, status: elem?.contestStatus});
    }
    const d = await client.set('dailyContestTime', JSON.stringify(arr));
}