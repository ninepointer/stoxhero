const Setting = require("../models/settings/setting");

exports.appLive = async()=>{
    const timmimg = await Setting.find();
    const setting = await Setting.findOneAndUpdate({_id : timmimg[0]._id}, {
        $set:{ 
            modifiedOn: new Date(),
            isAppLive: true
        }
    })
}

exports.appOffline = async()=>{
    const timming = await Setting.find();
    const setting = await Setting.findOneAndUpdate({_id : timming[0]._id}, {
        $set:{ 
            modifiedOn: new Date(),
            isAppLive: false
        }
    })
}


exports.infinityOffline = async()=>{
    const timmimg = await Setting.find();
    const setting = await Setting.findOneAndUpdate({_id : timmimg[0]._id}, {
        $set:{ 
            modifiedOn: new Date(),
            infinityLive: false
        }
    })
}
exports.infinityLive = async()=>{
    const timmimg = await Setting.find();
    const setting = await Setting.findOneAndUpdate({_id : timmimg[0]._id}, {
        $set:{ 
            modifiedOn: new Date(),
            infinityLive: true
        }
    })
}


