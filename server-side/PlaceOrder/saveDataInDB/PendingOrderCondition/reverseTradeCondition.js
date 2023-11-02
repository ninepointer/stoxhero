
const PendingOrder = require("../../../models/PendingOrder/pendingOrderSchema")
// const mongoose = require('mongoose')
const {applyingSLSP} = require("./applyingSLSP")
const { ObjectId } = require("mongodb");
const { client } = require('../../../marketData/redisClient');



exports.reverseTradeCondition = async (userId, id, doc, stopLossPrice, stopProfitPrice, docId, ltp) => {
    let pnl = await client.get(`${userId.toString()}${id.toString()}: overallpnlTenXTrader`)
    pnl = JSON.parse(pnl);
    const matchingElement = pnl.find((element) => (element._id.instrumentToken === doc.instrumentToken && element._id.product === doc.Product));
    const actualQuantity = Math.abs(Number(matchingElement?.lots));
    const newQuantity = Math.abs(Number(doc.Quantity));
    if(Math.abs(actualQuantity) === Math.abs(newQuantity)){
        data = await client.get('stoploss-stopprofit');
        data = JSON.parse(data);
        if (data && data[`${doc.instrumentToken}`]) {
            let symbolArray = data[`${doc.instrumentToken}`];
            let indicesToRemove = [];
            for(let i = symbolArray.length-1; i >= 0; i--){
                if(symbolArray[i].createdBy.toString() === userId.toString() && symbolArray[i].symbol === doc.symbol && symbolArray[i].order_type !== "LIMIT" ){
                    // remove this element
                    indicesToRemove.push(i);
                    const update = await PendingOrder.updateOne({_id: new ObjectId(symbolArray[i]._id)},{
                        $set: {
                            status: "Cancelled",
                            execution_time: new Date(),
                            execution_price: 0
                        }
                    })
                    //, status: "Pending", symbol: symbolArray[i].symbol

                }
            }

            // Remove elements after the loop
            console.log("indicesToRemove", indicesToRemove)
            indicesToRemove.forEach(index => symbolArray.splice(index, 1));
            data[`${doc.instrumentToken}`] = symbolArray;
        }

        

        await client.set('stoploss-stopprofit', JSON.stringify(data));

        return 0;
    } else if(Math.abs(actualQuantity) < Math.abs(newQuantity)){
        if(stopProfitPrice || stopLossPrice){
            data = await client.get('stoploss-stopprofit');
            data = JSON.parse(data);
            console.log("inside 1st if")
            if (data && data[`${doc.instrumentToken}`]) {
                let symbolArray = data[`${doc.instrumentToken}`];
                let indicesToRemove = [];
                for(let i = symbolArray.length-1; i >= 0; i--){

                    if(symbolArray[i].createdBy.toString() === userId.toString() && symbolArray[i].symbol === doc.symbol && symbolArray[i].order_type !== "LIMIT"){
                        // remove this element
                        indicesToRemove.push(i);
                        const update = await PendingOrder.updateOne({_id: new ObjectId(symbolArray[i]._id)},{
                            $set: {
                                status: "Cancelled",
                                execution_time: new Date(),
                                execution_price: 0
                            }
                        })
                        //, status: "Pending", symbol: symbolArray[i].symbol
                    }
                }
    
                // Remove elements after the loop
                console.log("indicesToRemove", indicesToRemove)
                indicesToRemove.forEach(index => symbolArray.splice(index, 1));
            }

            console.log("data", data);
            await client.set('stoploss-stopprofit', JSON.stringify(data));

            const otherData = {
                quantity: newQuantity - actualQuantity,
                stopProfitPrice: stopProfitPrice,
                stopLossPrice: stopLossPrice,
                ltp: ltp
            }

            console.log("going for apply slsp")
            await applyingSLSP(doc, otherData, undefined, docId);
            return 0;
        } else{
            data = await client.get('stoploss-stopprofit');
            data = JSON.parse(data);
            if (data && data[`${doc.instrumentToken}`]) {
                let symbolArray = data[`${doc.instrumentToken}`];
                let indicesToRemove = [];
                for(let i = symbolArray.length-1; i >= 0; i--){
                    if(symbolArray[i].createdBy.toString() === userId.toString() && symbolArray[i].symbol === doc.symbol && symbolArray[i].order_type !== "LIMIT"){
                        // remove this element
                        indicesToRemove.push(i);
                        const update = await PendingOrder.updateOne({_id: new ObjectId(symbolArray[i]._id)},{
                            $set: {
                                status: "Cancelled",
                                execution_time: new Date(),
                                execution_price: 0
                            }
                        })
                        //, status: "Pending", symbol: symbolArray[i].symbol

                    }
                }
    
                // Remove elements after the loop
                indicesToRemove.forEach(index => symbolArray.splice(index, 1));
            }

            await client.set('stoploss-stopprofit', JSON.stringify(data));
            return 0;
        }
    } else if(Math.abs(actualQuantity) > Math.abs(newQuantity)){
        const quantity = Math.abs(actualQuantity- newQuantity)
        data = await client.get('stoploss-stopprofit');
        data = JSON.parse(data);
        if (data && data[`${doc.instrumentToken}`]) {
            let symbolArray = data[`${doc.instrumentToken}`];

            await processOrder(symbolArray, newQuantity, data, doc, ltp)

            /*
            550 and ltp is 10 = 300

            stoplosses
            50   50   50   50   100 250
            9    8    9.5  7    6   5

            stoptargets
            50    50   100  250
            10.5  10   11   11.5

            if exit 250

            1. loop lgake quantity calaculate krni hogi both side sl and sp
            2. if quantity greater aati h then 
            */

            // let stoplossQuantity = 0;
            // let stopProfitQuantity = 0;
            // let newArr = [];
            // for(let i = symbolArray.length-1; i >= 0; i--){
            //     if(symbolArray[i].createdBy.toString() === userId.toString() && symbolArray[i].symbol === doc.symbol){
            //         if(symbolArray[i].type === "StopLoss"){
            //             stoplossQuantity += Number(symbolArray[i].Quantity)
            //         } else{
            //             stopProfitQuantity += Number(symbolArray[i].Quantity)
            //         }
            //     }
            // }


            // for(let i = symbolArray.length-1; i >= 0; i--){
            //     if(symbolArray[i].createdBy.toString() === userId.toString() && symbolArray[i].symbol === doc.symbol && (Number(symbolArray[i].Quantity) > quantity)){
            //         // remove this element
            //         symbolArray[i].Quantity = quantity;
            //         const update = await PendingOrder.updateOne({_id: new ObjectId(symbolArray[i]._id), status: "Pending", symbol: symbolArray[i].symbol},{
            //             $set: {Quantity: quantity}
            //         })
            //     }
            // }

            // await client.set('stoploss-stopprofit', JSON.stringify(data));

            // Remove elements after the loop
            // indicesToRemove.forEach(index => symbolArray.splice(index, 1));
        }

        return 0;
    }
}

async function processOrder(symbolArr, quantity, data, doc, ltp) {
    // Adjust the pending orders
    await adjustPendingOrders(symbolArr, quantity, 'StopLoss', 'desc', data, doc, ltp);
    await adjustPendingOrders(symbolArr, quantity, 'StopProfit', 'asc', data, doc, ltp);
}

async function adjustPendingOrders(symbolArr, quantity, stopOrderType, sortOrder, data, doc, ltp) {

    if (symbolArr) {
        // symbolArr = JSON.parse(symbolArr);

        // Sort the stop orders based on sortOrder
        if (sortOrder === 'desc') {
            // symbolArr.sort((a, b) => {
            //     if (a.type === "StopLoss" && b.type === "StopLoss") {
            //       return Math.abs(ltp - a.price) - Math.abs(ltp - b.price);
            //     }
            //     return 0; // If both elements are not StopLoss, leave them in their current order
            //   });

            symbolArr.sort((a, b) => b.price - a.price);
        } else {
            // symbolArr.sort((a, b) => {
            //     if (a.type === "StopLoss" && b.type === "StopLoss") {
            //       return Math.abs(ltp - b.price) - Math.abs(ltp - a.price);
            //     }
            //     return 0; // If both elements are not StopLoss, leave them in their current order
            //   });
            symbolArr.sort((a, b) => a.price - b.price);
        }

        // console.log(stopOrderType, symbolArr)

        // let indicesToRemove = [];
        for (let i = 0; i < symbolArr.length && quantity > 0; i++) {
            if (symbolArr[i].type === stopOrderType) {
                if (quantity >= symbolArr[i].Quantity) {
                    quantity -= symbolArr[i].Quantity;

                    // Update the status of the pending order in the database to 'cancelled'
                    await PendingOrder.findOneAndUpdate({
                        // userId,
                        // instrument,
                        // orderType: stopOrderType,
                        // price: symbolArr[i].price
                        _id: new ObjectId(symbolArr[i]?._id)
                    }, {
                        status: 'Cancelled',
                        execution_time: new Date(),
                        execution_price: 0
                    });

                    // Remove from Redis array
                    // indicesToRemove.push(i);
                    console.log("index to remove in ", stopOrderType, i)
                    symbolArr.splice(i, 1);
                    i--; // Adjust index due to array modification
                } else {
                    symbolArr[i].Quantity -= quantity;

                    // Update the quantity of the pending order in the database
                    await PendingOrder.findOneAndUpdate({
                        // userId,
                        // instrument,
                        // orderType: stopOrderType,
                        // price: symbolArr[i].price
                        _id: new ObjectId(symbolArr[i]?._id)
                    }, {
                        Quantity: symbolArr[i].Quantity
                    });

                    quantity = 0;
                }
            }
        }

        // indicesToRemove.sort((a, b) => b - a);
        // console.log("indicesToRemove", indicesToRemove)
        // indicesToRemove.forEach(index => symbolArr.splice(index, 1));


        data[`${doc.instrumentToken}`] = symbolArr;

        // Update Redis
        await client.set('stoploss-stopprofit', JSON.stringify(data));
    }
}