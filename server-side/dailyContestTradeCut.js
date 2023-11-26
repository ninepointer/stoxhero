const DailyContest = require('./models/DailyContest/dailyContest'); // Assuming your model is exported as Contest from the mentioned path
const {client} = require("./marketData/redisClient");
const {dailyContestSingleMockMod} = require("./controllers/AutoTradeCut/collectingTradeManually")
const ObjectId = require('mongodb').ObjectId;

exports.dailyContestTradeCut = async()=>{
    let data = await client.get('dailyContestTime');
    data = JSON.parse(data);
    for(let elem of data){
        // console.log(new Date(elem.endTime) , new Date() , elem.status );
        if(new Date(elem.endTime) <= new Date() && elem.status === "Active"){

            // console.log("in if");
            await dailyContestSingleMockMod(elem?._id);
            await DailyContest.findOneAndUpdate({_id: new ObjectId(elem?._id)}, {
                $set: {
                    contestStatus: "Completed"
                }
            })
            elem.status = "Completed";
            await client.set('dailyContestTime', JSON.stringify(data));

            return;
        }
    }
}

exports.dailyContestTimeStore = async()=>{
    // console.log("dailyContestTimeStore")
    const dailyContest = await DailyContest.find({contestStatus: "Active"});
    const arr = [];
    console.log("dailyContestTimeStore", dailyContest.length)
    for(let elem of dailyContest){
        console.log(":in if")
        arr.push({_id: elem?._id, endTime: elem?.contestEndTime, status: elem?.contestStatus});
        console.log(":in for")
    }
    console.log("arr", arr.length)
    const d = await client.set('dailyContestTime', JSON.stringify(arr));
    console.log("arr", d)
}