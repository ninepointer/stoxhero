const InfinityLiveTradeCompany = require("../../../models/TradeDetails/liveTradeSchema");
const Algo = require("../../../models/AlgoBox/tradingAlgoSchema")
const User = require("../../../models/User/userDetailSchema");
const Setting = require("../../../models/settings/setting");
const { autoPlaceOrder } = require("../xtsInteractive");
const { ObjectId } = require("mongodb");
const delay = ms => new Promise(res => setTimeout(res, ms));
const UserPermission = require("../../../models/User/permissionSchema");

const infinityTradeLive = async (res) => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    const setting = await Setting.updateOne({}, {
        modifiedOn: new Date(),
        infinityLive: false
      }, { new: true });


    const data = await InfinityLiveTradeCompany.aggregate(
        [
            {
                $match:
                {
                    trade_time: {
                        $gte: today
                    },
                    status: "COMPLETE",
                },
            },
            {
                $group:
                {
                    _id: {
                        userId: "$trader",
                        // subscriptionId: "$subscriptionId",
                        exchange: "$exchange",
                        symbol: "$symbol",
                        instrumentToken: "$instrumentToken",
                        exchangeInstrumentToken: "$exchangeInstrumentToken",
                        variety: "$variety",
                        validity: "$validity",
                        order_type: "$order_type",
                        Product: "$Product",
                        algoBoxId: "$algoBox"
                    },
                    runningLots: {
                        $sum: "$Quantity",
                    },
                    takeTradeQuantity: {
                        $sum: {
                            $multiply: ["$Quantity", -1],
                        },
                    },
                },
            },
            {
                $project:
                {
                    _id: 0,
                    userId: "$_id.userId",
                    // subscriptionId: "$_id.subscriptionId",
                    exchange: "$_id.exchange",
                    symbol: "$_id.symbol",
                    instrumentToken: "$_id.instrumentToken",
                    exchangeInstrumentToken: "$_id.exchangeInstrumentToken",
                    variety: "$_id.variety",
                    validity: "$_id.validity",
                    order_type: "$_id.order_type",
                    Product: "$_id.Product",
                    runningLots: "$runningLots",
                    takeTradeQuantity: "$takeTradeQuantity",
                    algoBoxId: "$_id.algoBoxId"
                },
            },
            {
                $match: {
                    runningLots: {
                        $ne: 0
                    },
                }
            }
    
        ]
    );

    if(data.length === 0){
        const updateRealTrade = await UserPermission.updateMany({}, { $set: { isRealTradeEnable: false } });
        res.status(200).json({message: "no real trade found. switched successfully."})
    }

    // console.log(data)
    for (let i = 0; i < data.length; i++) {
        // console.log("value of i", i)
        let date = new Date();
        let transaction_type = data[i].runningLots > 0 ? "BUY" : "SELL";
        let quantity = Math.abs(data[i].runningLots);

        let algoBox = await Algo.findOne({ status: "Active" })

        let realBuyOrSell
        if (transaction_type === "BUY") {
            realBuyOrSell = "SELL";
        } else {
            realBuyOrSell = "BUY";
        }

        let buyOrSell;
        if (algoBox.transactionChange) {
            if (realBuyOrSell === "BUY") {
                buyOrSell = "SELL";
            } else {
                buyOrSell = "BUY";
            }
        } else {
            buyOrSell = realBuyOrSell;
        }

        let system = await User.findOne({ email: "system@ninepointer.in" })
        let createdBy = system._id
        let Obj = {};
        Obj.symbol = data[i].symbol;
        Obj.Product = data[i].Product;
        Obj.instrumentToken = data[i].instrumentToken;
        Obj.exchangeInstrumentToken = data[i].exchangeInstrumentToken;
        Obj.real_instrument_token = data[i].instrumentToken;
        Obj.exchange = data[i].exchange;
        Obj.validity = data[i].validity;
        Obj.OrderType = data[i].order_type;
        Obj.variety = data[i].variety;
        Obj.buyOrSell = buyOrSell;
        Obj.realBuyOrSell = realBuyOrSell;
        Obj.trader = data[i].userId;
        Obj.algoBoxId = data[i].algoBoxId;
        Obj.autoTrade = true;
        Obj.dontSendResp = (i !== (data.length - 1));
        Obj.createdBy = createdBy;
        Obj.mockSwitch = true;

        const processOrder = async () => {
            if (quantity == 0) {
                return;
            } 
            else if (quantity > (data[i].symbol.includes("BANK") ? 900 : 1800)) {
                let tempQuantity = data[i].symbol.includes("BANK") ? 900 : 1800;
                    if (i === (data.length - 1)) {
                    Obj.dontSendResp = true;
                }
                // console.log("in else-if", Obj.dontSendResp, i, (data.length - 1))
                Obj.Quantity = tempQuantity;
                Obj.userQuantity = tempQuantity / algoBox.lotMultipler;
                Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`;
                // console.log("before autoPlaceOrder else-if", Obj);
                Obj.marginData = {isSquareOff: false, isAddMoreFund: false, isReleaseFund: true, zerodhaMargin: 0, runningLots: quantity};

                await autoPlaceOrder(Obj, res);
                //console.log("now in if", performance.now()-now, quantity);
                quantity = quantity - tempQuantity;
                await delay(300);
                processOrder();
            } else {
                Obj.Quantity = quantity;
                Obj.userQuantity = quantity / algoBox.lotMultipler;
                Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`;
                // console.log("in else", Obj.dontSendResp, i, (data.length - 1))
                if (i === (data.length - 1)) {
                    Obj.dontSendResp = false;
                }
                //console.log("now in else", performance.now()-now, quantity);
                // console.log("before autoPlaceOrder else", Obj);
                Obj.marginData = {isSquareOff: true, isAddMoreFund: false, isReleaseFund: false, zerodhaMargin: 0, runningLots: quantity};

                await autoPlaceOrder(Obj, res);
            }
        };

        await processOrder();
    }

    return;
}

const infinityTradeLiveSingle = async (res, req) => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
    const {userId} = req.params;


    const data = await InfinityLiveTradeCompany.aggregate(
        [
            {
                $match:
                {
                    trade_time: {
                        $gte: today
                    },
                    status: "COMPLETE",
                    trader: new ObjectId(userId)
                },
            },
            {
                $group:
                {
                    _id: {
                        userId: "$trader",
                        // subscriptionId: "$subscriptionId",
                        exchange: "$exchange",
                        symbol: "$symbol",
                        instrumentToken: "$instrumentToken",
                        exchangeInstrumentToken: "$exchangeInstrumentToken",
                        variety: "$variety",
                        validity: "$validity",
                        order_type: "$order_type",
                        Product: "$Product",
                        algoBoxId: "$algoBox"
                    },
                    runningLots: {
                        $sum: "$Quantity",
                    },
                    takeTradeQuantity: {
                        $sum: {
                            $multiply: ["$Quantity", -1],
                        },
                    },
                },
            },
            {
                $project:
                {
                    _id: 0,
                    userId: "$_id.userId",
                    // subscriptionId: "$_id.subscriptionId",
                    exchange: "$_id.exchange",
                    symbol: "$_id.symbol",
                    instrumentToken: "$_id.instrumentToken",
                    exchangeInstrumentToken: "$_id.exchangeInstrumentToken",
                    variety: "$_id.variety",
                    validity: "$_id.validity",
                    order_type: "$_id.order_type",
                    Product: "$_id.Product",
                    runningLots: "$runningLots",
                    takeTradeQuantity: "$takeTradeQuantity",
                    algoBoxId: "$_id.algoBoxId"
                },
            },
            {
                $match: {
                    runningLots: {
                        $ne: 0
                    },
                }
            }
    
        ]
    );

    for (let i = 0; i < data.length; i++) {
        let date = new Date();
        let transaction_type = data[i].runningLots > 0 ? "BUY" : "SELL";
        let quantity = Math.abs(data[i].runningLots);

        let algoBox = await Algo.findOne({ status: "Active" })

        let realBuyOrSell
        if (transaction_type === "BUY") {
            realBuyOrSell = "SELL";
        } else {
            realBuyOrSell = "BUY";
        }

        let buyOrSell;
        if (algoBox.transactionChange) {
            if (realBuyOrSell === "BUY") {
                buyOrSell = "SELL";
            } else {
                buyOrSell = "BUY";
            }
        } else {
            buyOrSell = realBuyOrSell;
        }

        let system = await User.findOne({ email: "system@ninepointer.in" })
        let createdBy = system._id
        let Obj = {};
        Obj.symbol = data[i].symbol;
        Obj.Product = data[i].Product;
        Obj.instrumentToken = data[i].instrumentToken;
        Obj.exchangeInstrumentToken = data[i].exchangeInstrumentToken;
        Obj.real_instrument_token = data[i].instrumentToken;
        Obj.exchange = data[i].exchange;
        Obj.validity = data[i].validity;
        Obj.OrderType = data[i].order_type;
        Obj.variety = data[i].variety;
        Obj.buyOrSell = buyOrSell;
        Obj.realBuyOrSell = realBuyOrSell;
        Obj.trader = data[i].userId;
        Obj.algoBoxId = data[i].algoBoxId;
        Obj.autoTrade = true;
        Obj.dontSendResp = (i !== (data.length - 1));
        Obj.createdBy = createdBy;
        Obj.mockSwitch = true;
        Obj.singleUser = true;

        const processOrder = async () => {
            if (quantity == 0) {
                return;
            } 
            else if (quantity > (data[i].symbol.includes("BANK") ? 900 : 1800)) {
                let tempQuantity = data[i].symbol.includes("BANK") ? 900 : 1800;
                    
                if (i === (data.length - 1)) {
                    Obj.dontSendResp = true;
                }
                // console.log("in else-if", Obj.dontSendResp, i, (data.length - 1))
                Obj.Quantity = tempQuantity;
                Obj.userQuantity = tempQuantity / algoBox.lotMultipler;
                Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`;
                Obj.marginData = {isSquareOff: false, isAddMoreFund: false, isReleaseFund: true, zerodhaMargin: 0, runningLots: quantity};
                await autoPlaceOrder(Obj, res);
                quantity = quantity - tempQuantity;
                await delay(300);
                processOrder();
            } else {
                Obj.Quantity = quantity;
                Obj.userQuantity = quantity / algoBox.lotMultipler;
                Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`;
                if (i === (data.length - 1)) {
                    Obj.dontSendResp = false;
                }

                Obj.marginData = {isSquareOff: true, isAddMoreFund: false, isReleaseFund: false, zerodhaMargin: 0, runningLots: quantity};
                await autoPlaceOrder(Obj, res);
            }
        };

        await processOrder();
    }

    return;
}

module.exports = { infinityTradeLive, infinityTradeLiveSingle };