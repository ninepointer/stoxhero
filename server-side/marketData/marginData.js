const axios = require("axios");
const getKiteCred = require('./getKiteCred'); 
const InfinityMockUserMargin = require("../models/marginUsed/infinityMockUserMargin");
const InfinityMockCompanyMargin = require("../models/marginUsed/infinityMockCompanyMargin");
const InfinityLiveUserMargin = require("../models/marginUsed/infinityLiveUserMargin");
const InfinityLiveCompanyMargin = require("../models/marginUsed/infinityLiveCompanyMargin");



const marginApi = async (tradeData, quantity) => {

    const { exchange, symbol, realBuyOrSell, variety,
            Product, OrderType } = tradeData;

    // console.log("inside margin api")
    try {
        let data = await getKiteCred.getAccess();

        // console.log("inside kite cred", data)

        let auth = 'token ' + data.getApiKey + ':' + data.getAccessToken;
        let headers = {
            'X-Kite-Version': '3',
            'Authorization': auth,
            "content-type": "application/json"
        }
        let orderData = [{
            "exchange": exchange,
            "tradingsymbol": symbol,
            "transaction_type": realBuyOrSell,
            "variety": variety,
            "product": Product,
            "order_type": OrderType,
            "quantity": quantity,
            "price": 0,
            "trigger_price": 0
        }]

        let marginData;
        let zerodhaMargin;

        // console.log("orderData", orderData)
        try {
            marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, { headers: headers })
            zerodhaMargin = marginData.data.data.orders[0].total;

            console.log("zerodhaMargin", zerodhaMargin);
        } catch (e) {
            console.log("error fetching zerodha margin", e);
        }

        return zerodhaMargin;
    } catch (err) {
        console.log(err);
    }

}

exports.marginCalculationTrader = async (marginData, data, ltp, order_id) => {
    let {userQuantity, symbol, buyOrSell, Quantity, trader, autoTrade} = data;
    let {isReleaseFund, isAddMoreFund, isSquareOff, zerodhaMargin, runningLots} = marginData;
    
    if(userQuantity){
        Quantity = userQuantity;
    }
    if(autoTrade && buyOrSell === "SELL"){
        runningLots = -runningLots;
    }
    
    let margin_released = 0;
    let margin_utilize = 0;
    let type, parent_id;

    if(!runningLots && isAddMoreFund){
        margin_released = 0;
        type = "Order";
        avg_price = ltp;
    }
    if(runningLots && isAddMoreFund){
        const previousData = await InfinityMockUserMargin.find({instrument: symbol, parent_id: null, trader: trader}).sort({date: -1});
        parent_id = previousData[0]?.order_id;
        type = "Trade";

        const previousDataForAvgPrice = await InfinityMockUserMargin.find({instrument: symbol, parent_id: previousData[0]?.order_id, transaction_type: previousData[0]?.transaction_type, trader: trader});
        let amountPrev = 0;
        let quantityPrev = 0;
        if(!previousDataForAvgPrice?.length){
            avg_price = (Math.abs(Quantity * ltp) + Math.abs(previousData[0]?.amount))/(Math.abs(Quantity) + Math.abs(previousData[0]?.quantity))
        } else{
            for(let elem of previousDataForAvgPrice){
                amountPrev = amountPrev + elem.amount;
                quantityPrev = quantityPrev + elem.quantity;
            }

            // console.log("previousData previousDataForAvgPrice", previousData, previousDataForAvgPrice)
            avg_price = (Math.abs(amountPrev) + Math.abs(previousData[0]?.amount))/(Math.abs(quantityPrev) + Math.abs(previousData[0]?.quantity))
    
        }
    }
    if(buyOrSell === "SELL"){
        Quantity = -Quantity;
    }
    if(isAddMoreFund && buyOrSell === "SELL"){
        // margin_utilize = zerodhaMargin;
        if(isAddMoreFund && isReleaseFund){
            let marginQuantity = Math.abs(Math.abs(runningLots) - Math.abs(Quantity));
            margin_utilize = await marginApi(data, marginQuantity);
            // console.log("marginQuantity", marginQuantity, margin_utilize)

        } else{
            margin_utilize = await marginApi(data, Math.abs(Quantity));
        }
    }
    if(isAddMoreFund && buyOrSell === "BUY"){
        // margin_utilize = ltp*Math.abs(Quantity);
        if(isAddMoreFund && isReleaseFund){
            let marginQuantity = Math.abs(Math.abs(runningLots) - Math.abs(Quantity));
            margin_utilize = ltp*Math.abs(marginQuantity);
        } else{
            margin_utilize = ltp*Math.abs(Quantity);
        }
    }
    if(isReleaseFund || isSquareOff){
        
        if(!isAddMoreFund) margin_utilize = 0;
        type = "Trade";
        const previousData = await InfinityMockUserMargin.find({instrument: symbol, parent_id: null, trader: trader}).sort({date: -1});
        parent_id = previousData[0]?.order_id;

        const previousDataForAvgPrice = await InfinityMockUserMargin.find({instrument: symbol, parent_id: previousData[0]?.order_id, trader: trader});
        if(!previousDataForAvgPrice?.length){
            avg_price = ltp;
            if(isSquareOff) margin_released = previousData[0]?.margin_utilize;
            if(isReleaseFund) margin_released = previousData[0]?.margin_utilize*(Math.abs(Quantity)/Math.abs(previousData[0]?.quantity));
            if(isReleaseFund && isAddMoreFund) margin_released = previousData[0]?.margin_utilize*(Math.abs(runningLots)/Math.abs(previousData[0]?.quantity)); 

        } else{
            let amountAvgCal = 0;
            let quantityPrev = 0;
            let quantityAvgCal = 0;
            let totalMarginReleased = 0;
            let totalMarginUtilise = 0;

            for(let elem of previousDataForAvgPrice){
                if(elem.transaction_type == buyOrSell){
                    amountAvgCal = amountAvgCal + elem.amount;
                    quantityAvgCal = quantityAvgCal + elem.amount;
                }
                // amountPrev = amountPrev + elem.amount;
                quantityPrev = quantityPrev + elem.quantity;
                totalMarginReleased = totalMarginReleased + elem.margin_released;
                totalMarginUtilise = totalMarginUtilise + elem.margin_utilize;

            }

            if(isSquareOff) margin_released = (previousData[0]?.margin_utilize+totalMarginUtilise-totalMarginReleased)
            if(isReleaseFund) margin_released = (previousData[0]?.margin_utilize+totalMarginUtilise-totalMarginReleased)*(Math.abs(Quantity)/Math.abs(quantityPrev + previousData[0]?.quantity));    
            if(isReleaseFund && isAddMoreFund) margin_released = (previousData[0]?.margin_utilize+totalMarginUtilise-totalMarginReleased)*(Math.abs(runningLots)/Math.abs(quantityPrev+previousData[0]?.quantity)); 


            // console.log("Math.abs(amountPrev)/Math.abs(quantityPrev)",previousDataForAvgPrice, Math.abs(amountPrev), Math.abs(quantityPrev))
    
            if(amountAvgCal && quantityAvgCal){
                avg_price = Math.abs(amountAvgCal)/Math.abs(quantityAvgCal);
            } else{
                avg_price = 0;
            }    
        }
    }
    // console.log("Quantity + runningLots", Quantity , runningLots)
    const insertMarginData = await InfinityMockUserMargin.create({trader, instrument: symbol, quantity: Quantity, ltp, transaction_type: buyOrSell,
        open_lots: Quantity + runningLots, amount: ltp*Number(Quantity), margin_released, margin_utilize, type, order_id, parent_id, avg_price })

}

exports.marginCalculationCompany = async (marginData, data, ltp, order_id) => {
    // console.log("marginData", marginData)
    let {Quantity, userQuantity, symbol, realBuyOrSell, realQuantity, trader, autoTrade} = data;
    let {isReleaseFund, isAddMoreFund, isSquareOff, zerodhaMargin, runningLots} = marginData;

    if(autoTrade){
        realQuantity = Quantity;
    }
    if(!autoTrade){
        runningLots = -runningLots;
    }
    if(autoTrade && realBuyOrSell === "SELL"){
        runningLots = -runningLots;
    }
    

    // console.log(symbol, realBuyOrSell, realQuantity, trader, isReleaseFund, isAddMoreFund, isSquareOff, runningLots)

    // console.log(symbol, realBuyOrSell, realQuantity, trader, isReleaseFund, isAddMoreFund, isSquareOff, runningLots)
    let margin_released = 0;
    let margin_utilize = 0;
    let type, parent_id;

    if(!runningLots && isAddMoreFund){
        margin_released = 0;
        type = "Order";
        avg_price = ltp;
    }
    if(runningLots && isAddMoreFund){
        const previousData = await InfinityMockCompanyMargin.find({instrument: symbol, parent_id: null, trader: trader}).sort({date: -1});
        parent_id = previousData[0]?.order_id;
        type = "Trade";

        const previousDataForAvgPrice = await InfinityMockCompanyMargin.find({instrument: symbol, parent_id: previousData[0]?.order_id, transaction_type: previousData[0]?.transaction_type, trader: trader});
        let amountPrev = 0;
        let quantityPrev = 0;
        if(!previousDataForAvgPrice?.length){
            avg_price = (Math.abs(realQuantity * ltp) + Math.abs(previousData[0]?.amount))/(Math.abs(realQuantity) + Math.abs(previousData[0]?.quantity))
        } else{
            for(let elem of previousDataForAvgPrice){
                amountPrev = amountPrev + elem.amount;
                quantityPrev = quantityPrev + elem.quantity;
            }
            // console.log("previousData previousDataForAvgPrice", previousData, previousDataForAvgPrice)
            avg_price = (Math.abs(amountPrev) + Math.abs(previousData[0]?.amount))/(Math.abs(quantityPrev) + Math.abs(previousData[0]?.quantity))
        }
    }

    if(realBuyOrSell === "SELL"){
        realQuantity = -realQuantity;
    }
    if(isAddMoreFund && realBuyOrSell === "SELL"){
        if(isAddMoreFund && isReleaseFund){
            let marginQuantity = Math.abs(Math.abs(runningLots) - Math.abs(realQuantity));
            margin_utilize = await marginApi(data, marginQuantity);
            // console.log("marginQuantity", marginQuantity, margin_utilize)

        } else{
            margin_utilize = await marginApi(data, Math.abs(realQuantity));
        }
    }
    if(isAddMoreFund && realBuyOrSell === "BUY"){
        if(isAddMoreFund && isReleaseFund){
            let marginQuantity = Math.abs(Math.abs(runningLots) - Math.abs(realQuantity));
            margin_utilize = ltp*Math.abs(marginQuantity);
        } else{
            margin_utilize = ltp*Math.abs(realQuantity);
        }
    }
    if(isReleaseFund || isSquareOff){
        if(!isAddMoreFund) margin_utilize = 0;
        type = "Trade";
        const previousData = await InfinityMockCompanyMargin.find({instrument: symbol, parent_id: null, trader: trader}).sort({date: -1});
        parent_id = previousData[0]?.order_id;

        const previousDataForAvgPrice = await InfinityMockCompanyMargin.find({instrument: symbol, parent_id: previousData[0]?.order_id, trader: trader}).sort({date: -1})
        if(!previousDataForAvgPrice?.length){
            avg_price = ltp;
            if(isSquareOff) margin_released = previousData[0]?.margin_utilize;
            if(isReleaseFund) margin_released = previousData[0]?.margin_utilize*(Math.abs(realQuantity)/Math.abs(previousData[0]?.quantity));    
            if(isReleaseFund && isAddMoreFund) margin_released = previousData[0]?.margin_utilize*(Math.abs(runningLots)/Math.abs(previousData[0]?.quantity)); 
        } else{
            let amountAvgCal = 0;
            let quantityPrev = 0;
            let quantityAvgCal = 0;
            let totalMarginReleased = 0;
            let totalMarginUtilise = 0;
    
            for(let elem of previousDataForAvgPrice){
                if(elem.transaction_type == realBuyOrSell){
                    amountAvgCal = amountAvgCal + elem.amount;
                    quantityAvgCal = quantityAvgCal + elem.amount;
                }
                // amountPrev = amountPrev + elem.amount;
                quantityPrev = quantityPrev + elem.quantity;
                totalMarginReleased = totalMarginReleased + elem.margin_released;
                totalMarginUtilise = totalMarginUtilise + elem.margin_utilize;
            }

            if(isSquareOff) margin_released = (previousData[0]?.margin_utilize+totalMarginUtilise-totalMarginReleased)
            if(isReleaseFund && !isAddMoreFund) margin_released = (previousData[0]?.margin_utilize+totalMarginUtilise-totalMarginReleased)*(Math.abs(realQuantity)/Math.abs(quantityPrev + previousData[0]?.quantity));    
            if(isReleaseFund && isAddMoreFund) margin_released = (previousData[0]?.margin_utilize+totalMarginUtilise-totalMarginReleased)*(Math.abs(runningLots)/Math.abs(quantityPrev+previousData[0]?.quantity)); 

    
            // console.log("Math.abs(amountPrev)/Math.abs(quantityPrev)",previousDataForAvgPrice, Math.abs(amountPrev), Math.abs(quantityPrev))
            if(amountAvgCal && quantityAvgCal){
                avg_price = Math.abs(amountAvgCal)/Math.abs(quantityAvgCal);
            } else{
                avg_price = 0;
            }
        }
    }

    // console.log("realQuantity + runningLots", realQuantity , runningLots)
    const insertMarginData = await InfinityMockCompanyMargin.create({trader, instrument: symbol, quantity: realQuantity, ltp, transaction_type: realBuyOrSell,
        open_lots: realQuantity + runningLots, amount: ltp*Number(realQuantity), margin_released, margin_utilize, type, order_id, parent_id, avg_price })

}

exports.marginCalculationTraderLive = async (marginData, data, ltp, order_id) => {
    let {Quantity, userQuantity, symbol, realBuyOrSell, realQuantity, trader, buyOrSell, autoTrade} = data;
    let {isReleaseFund, isAddMoreFund, isSquareOff, zerodhaMargin, runningLots} = marginData;

    if(userQuantity){
        Quantity = userQuantity;
    }
    if(autoTrade && buyOrSell === "SELL"){
        runningLots = -runningLots;
    }
    let margin_released = 0;
    let margin_utilize = 0;
    let type, parent_id;

    if(!runningLots && isAddMoreFund){
        margin_released = 0;
        type = "Order";
        avg_price = ltp;
    }
    if(runningLots && isAddMoreFund){
        const previousData = await InfinityMockUserMargin.find({instrument: symbol, parent_id: null, trader: trader}).sort({date: -1});
        parent_id = previousData[0]?.order_id;
        type = "Trade";

        const previousDataForAvgPrice = await InfinityMockUserMargin.find({instrument: symbol, parent_id: previousData[0]?.order_id, transaction_type: previousData[0]?.transaction_type, trader: trader});
        let amountPrev = 0;
        let quantityPrev = 0;
        if(!previousDataForAvgPrice?.length){
            avg_price = (Math.abs(Quantity * ltp) + Math.abs(previousData[0]?.amount))/(Math.abs(Quantity) + Math.abs(previousData[0]?.quantity))
        } else{
            for(let elem of previousDataForAvgPrice){
                amountPrev = amountPrev + elem.amount;
                quantityPrev = quantityPrev + elem.quantity;
            }

            // console.log("previousData previousDataForAvgPrice", previousData, previousDataForAvgPrice)
            avg_price = (Math.abs(amountPrev) + Math.abs(previousData[0]?.amount))/(Math.abs(quantityPrev) + Math.abs(previousData[0]?.quantity))
    
        }
    }
    if(buyOrSell === "SELL"){
        Quantity = -Quantity;
    }
    if(isAddMoreFund && buyOrSell === "SELL"){
        if(isAddMoreFund && isReleaseFund){
            // if release and add both happens then like 100 buy then sell -200.
            let marginQuantity = Math.abs(Math.abs(runningLots) - Math.abs(Quantity));
            margin_utilize = await marginApi(data, marginQuantity);
            // console.log("marginQuantity", marginQuantity, margin_utilize)

        } else{
            margin_utilize = await marginApi(data, Math.abs(Quantity));
        }
    }
    if(isAddMoreFund && buyOrSell === "BUY"){
        // margin_utilize = ltp*Math.abs(Quantity);
        if(isAddMoreFund && isReleaseFund){
            let marginQuantity = Math.abs(Math.abs(runningLots) - Math.abs(Quantity));
            margin_utilize = ltp*Math.abs(marginQuantity);
        } else{
            margin_utilize = ltp*Math.abs(Quantity);
        }
    }
    if(isReleaseFund || isSquareOff){
        
        if(!isAddMoreFund) margin_utilize = 0;
        type = "Trade";
        const previousData = await InfinityMockUserMargin.find({instrument: symbol, parent_id: null, trader: trader}).sort({date: -1});
        parent_id = previousData[0]?.order_id;

        const previousDataForAvgPrice = await InfinityMockUserMargin.find({instrument: symbol, parent_id: previousData[0]?.order_id, trader: trader});
        if(!previousDataForAvgPrice?.length){
            avg_price = ltp;
            if(isSquareOff) margin_released = previousData[0]?.margin_utilize;
            if(isReleaseFund) margin_released = previousData[0]?.margin_utilize*(Math.abs(Quantity)/Math.abs(previousData[0]?.quantity));
            if(isReleaseFund && isAddMoreFund) margin_released = previousData[0]?.margin_utilize*(Math.abs(runningLots)/Math.abs(previousData[0]?.quantity)); 

        } else{
            let amountAvgCal = 0;
            let quantityPrev = 0;
            let quantityAvgCal = 0;
            let totalMarginReleased = 0;
            let totalMarginUtilise = 0;

            for(let elem of previousDataForAvgPrice){
                if(elem.transaction_type == buyOrSell){
                    amountAvgCal = amountAvgCal + elem.amount;
                    quantityAvgCal = quantityAvgCal + elem.amount;
                }
                // amountPrev = amountPrev + elem.amount;
                quantityPrev = quantityPrev + elem.quantity;
                totalMarginReleased = totalMarginReleased + elem.margin_released;
                totalMarginUtilise = totalMarginUtilise + elem.margin_utilize;

            }

            if(isSquareOff) margin_released = (previousData[0]?.margin_utilize+totalMarginUtilise-totalMarginReleased)
            if(isReleaseFund) margin_released = (previousData[0]?.margin_utilize+totalMarginUtilise-totalMarginReleased)*(Math.abs(Quantity)/Math.abs(quantityPrev + previousData[0]?.quantity));    
            if(isReleaseFund && isAddMoreFund) margin_released = (previousData[0]?.margin_utilize+totalMarginUtilise-totalMarginReleased)*(Math.abs(runningLots)/Math.abs(quantityPrev+previousData[0]?.quantity)); 


            // console.log("Math.abs(amountPrev)/Math.abs(quantityPrev)",previousDataForAvgPrice, Math.abs(amountPrev), Math.abs(quantityPrev))
    
            if(amountAvgCal && quantityAvgCal){
                avg_price = Math.abs(amountAvgCal)/Math.abs(quantityAvgCal);
            } else{
                avg_price = 0;
            }    
        }
    }


    if(!autoTrade){
        const insertMarginData = await InfinityMockUserMargin.create({
            trader, instrument: symbol, quantity: Quantity, ltp, transaction_type: buyOrSell,
            open_lots: Quantity + runningLots, amount: ltp * Number(Quantity), margin_released, margin_utilize, type, order_id, parent_id, avg_price
        })
    }

    const insertMarginDataLive = await InfinityLiveUserMargin.create({
        trader, instrument: symbol, quantity: Quantity, ltp, transaction_type: buyOrSell,
        open_lots: Quantity + runningLots, amount: ltp * Number(Quantity), margin_released, margin_utilize, type, order_id, parent_id, avg_price
    })
    
}

exports.marginCalculationCompanyLive = async (marginData, data, ltp, order_id) => {
    let {Quantity, userQuantity, symbol, realBuyOrSell, realQuantity, trader, autoTrade, buyOrSell} = data;
    let {isReleaseFund, isAddMoreFund, isSquareOff, zerodhaMargin, runningLots} = marginData;

    console.log("data is", data, marginData)
    if(autoTrade && realBuyOrSell === "SELL"){
        runningLots = -runningLots;
    }

    if(!autoTrade){
        runningLots = -runningLots;
    }

    let margin_released = 0;
    let margin_utilize = 0;
    let type, parent_id;

    if(!runningLots && isAddMoreFund){
        margin_released = 0;
        type = "Order";
        avg_price = ltp;
    }

    if(runningLots && isAddMoreFund){
        const previousData = await InfinityMockCompanyMargin.find({instrument: symbol, parent_id: null, trader: trader}).sort({date: -1});
        parent_id = previousData[0]?.order_id;
        type = "Trade";

        const previousDataForAvgPrice = await InfinityMockCompanyMargin.find({instrument: symbol, parent_id: previousData[0]?.order_id, transaction_type: previousData[0]?.transaction_type, trader: trader});
        let amountPrev = 0;
        let quantityPrev = 0;
        if(!previousDataForAvgPrice?.length){
            avg_price = (Math.abs(realQuantity * ltp) + Math.abs(previousData[0]?.amount))/(Math.abs(realQuantity) + Math.abs(previousData[0]?.quantity))
        } else{
            for(let elem of previousDataForAvgPrice){
                amountPrev = amountPrev + elem.amount;
                quantityPrev = quantityPrev + elem.quantity;
            }
            avg_price = (Math.abs(amountPrev) + Math.abs(previousData[0]?.amount))/(Math.abs(quantityPrev) + Math.abs(previousData[0]?.quantity))
        }
    }

    if(realBuyOrSell === "SELL"){
        realQuantity = -realQuantity;
    }

    if(isAddMoreFund && realBuyOrSell === "SELL"){
        if(isAddMoreFund && isReleaseFund){
            let marginQuantity = Math.abs(Math.abs(runningLots) - Math.abs(realQuantity));
            margin_utilize = await marginApi(data, marginQuantity);
            // console.log("marginQuantity", marginQuantity, margin_utilize)

        } else{
            margin_utilize = await marginApi(data, Math.abs(realQuantity));
        }
    }

    if(isAddMoreFund && realBuyOrSell === "BUY"){
        if(isAddMoreFund && isReleaseFund){
            let marginQuantity = Math.abs(Math.abs(runningLots) - Math.abs(realQuantity));
            margin_utilize = ltp*Math.abs(marginQuantity);
        } else{
            margin_utilize = ltp*Math.abs(realQuantity);
        }
    }

    if(isReleaseFund || isSquareOff){
        if(!isAddMoreFund) margin_utilize = 0;
        type = "Trade";
        const previousData = await InfinityMockCompanyMargin.find({instrument: symbol, parent_id: null, trader: trader}).sort({date: -1});
        parent_id = previousData[0]?.order_id;

        const previousDataForAvgPrice = await InfinityMockCompanyMargin.find({instrument: symbol, parent_id: previousData[0]?.order_id, trader: trader}).sort({date: -1})
        // console.log("previousData", previousData, previousDataForAvgPrice)
        if(!previousDataForAvgPrice?.length){
            avg_price = ltp;
            if(isSquareOff) margin_released = previousData[0]?.margin_utilize;
            if(isReleaseFund) margin_released = previousData[0]?.margin_utilize*(Math.abs(realQuantity)/Math.abs(previousData[0]?.quantity));    
            if(isReleaseFund && isAddMoreFund) margin_released = previousData[0]?.margin_utilize*(Math.abs(runningLots)/Math.abs(previousData[0]?.quantity)); 
        } else{
            let amountAvgCal = 0;
            let quantityPrev = 0;
            let quantityAvgCal = 0;
            let totalMarginReleased = 0;
            let totalMarginUtilise = 0;
    
            for(let elem of previousDataForAvgPrice){
                if(elem.transaction_type == realBuyOrSell){
                    amountAvgCal = amountAvgCal + elem.amount;
                    quantityAvgCal = quantityAvgCal + elem.amount;
                }
                // amountPrev = amountPrev + elem.amount;
                quantityPrev = quantityPrev + elem.quantity;
                totalMarginReleased = totalMarginReleased + elem.margin_released;
                totalMarginUtilise = totalMarginUtilise + elem.margin_utilize;
            }

            if(isSquareOff) margin_released = (previousData[0]?.margin_utilize+totalMarginUtilise-totalMarginReleased)
            if(isReleaseFund && !isAddMoreFund) margin_released = (previousData[0]?.margin_utilize+totalMarginUtilise-totalMarginReleased)*(Math.abs(realQuantity)/Math.abs(quantityPrev + previousData[0]?.quantity));    
            if(isReleaseFund && isAddMoreFund) margin_released = (previousData[0]?.margin_utilize+totalMarginUtilise-totalMarginReleased)*(Math.abs(runningLots)/Math.abs(quantityPrev+previousData[0]?.quantity)); 

    
            // console.log("Math.abs(amountPrev)/Math.abs(quantityPrev)",previousDataForAvgPrice, Math.abs(amountPrev), Math.abs(quantityPrev))
            if(amountAvgCal && quantityAvgCal){
                avg_price = Math.abs(amountAvgCal)/Math.abs(quantityAvgCal);
            } else{
                avg_price = 0;
            }
        }
    }

    if(!autoTrade){
        const insertMarginData = await InfinityMockCompanyMargin.create({
            trader, instrument: symbol, quantity: realQuantity, ltp, transaction_type: realBuyOrSell,
            open_lots: realQuantity + runningLots, amount: ltp * Number(realQuantity), margin_released, margin_utilize, type, order_id, parent_id, avg_price
        })
    }

    const insertMarginDataLive = await InfinityLiveCompanyMargin.create({
        trader, instrument: symbol, quantity: realQuantity, ltp, transaction_type: realBuyOrSell,
        open_lots: realQuantity + runningLots, amount: ltp * Number(realQuantity), margin_released, margin_utilize, type, order_id, parent_id, avg_price
    })
    
}