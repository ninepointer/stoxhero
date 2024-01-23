const { ObjectId } = require("mongodb");
const PendingOrder = require("../models/PendingOrder/pendingOrderSchema")
const { client, getValue } = require('../marketData/redisClient');
const { applyingSLSP } = require("../PlaceOrder/saveDataInDB/PendingOrderCondition/applyingSLSP")
const { maxLot_BankNifty, maxLot_Nifty, maxLot_FinNifty, stock,
  virtualTrader, internTrader, tenxTrader, dailyContest, marginx } = require("../constant");
const getKiteCred = require('../marketData/getKiteCred');
const axios = require("axios");
const {marginDetailDataBase, pnlPositionDatabase, pnlHoldingDatabase} = require("../controllers/stockTradeController");


exports.myTodaysProcessedTrade = async (req, res, next) => {

  let { id, from } = req.params;
  // console.log(from)
  // from = from.includes("%20") ? from.split("%20")[0] + " " + from.split("%20")[1] : from;
  const userId = req?.user?._id;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  let product_type;
  try {

    if (from === tenxTrader) {
      product_type = "6517d3803aeb2bb27d650de0"
    } else if (from === marginx) {
      product_type = "6517d40e3aeb2bb27d650de1"
    } else if (from === dailyContest) {
      product_type = "6517d48d3aeb2bb27d650de5"
    } else if (from === internTrader) {
      product_type = "6517d46e3aeb2bb27d650de3"
    } else if (from === virtualTrader) {
      product_type = "65449ee06932ba3a403a681a"
    } else if (from === stock) {
      product_type = "6583c2012ef31a319cf888c9"
    }


    console.log(from, tenxTrader, product_type, userId, id)

    const count = await PendingOrder.countDocuments({
      product_type: new ObjectId(
        product_type
      ),
      createdBy: new ObjectId(
        userId
      ),
      createdOn: {
        $gte: today,
      },
      status: { $ne: "Pending" },
      sub_product_id: new ObjectId(id)
    })

    const myTodaysTrade = await PendingOrder.aggregate([
      {
        $match: {
          product_type: new ObjectId(
            product_type
          ),
          createdBy: new ObjectId(
            userId
          ),
          createdOn: {
            $gte: today,
          },
          status: { $ne: "Pending" },
          sub_product_id: new ObjectId(id)
        },
      },
      {
        $project: {
          symbol: 1,
          _id: 1,
          buyOrSell: 1,
          Quantity: 1,
          execution_price: 1,
          price: 1,
          execution_time: 1,
          amount: {
            $multiply: [
              "$price",
              "$Quantity",
            ],
          },
          type: 1,
          status: 1,
          symbol: 1,
          time: "$createdOn",
        },
      },
      {
        $sort:
        {
          time: -1,
        },
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ])
    res.status(200).json({ status: 'success', data: myTodaysTrade, count: count ? count : 0 });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

exports.myTodaysPendingTrade = async (req, res, next) => {

  let { id, from } = req.params;

  // from = from.includes("%20") && from.split("%20")[0] + " " + from.split("%20")[1]

  const userId = req.user._id;
  let date = new Date();
  let product_type;
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  try {

    if (from === tenxTrader) {
      product_type = "6517d3803aeb2bb27d650de0"
    } else if (from === marginx) {
      product_type = "6517d40e3aeb2bb27d650de1"
    } else if (from === dailyContest) {
      product_type = "6517d48d3aeb2bb27d650de5"
    } else if (from === internTrader) {
      product_type = "6517d46e3aeb2bb27d650de3"
    } else if (from === virtualTrader) {
      product_type = "65449ee06932ba3a403a681a"
    } else if (from === stock) {
      product_type = "6583c2012ef31a319cf888c9"
    }

    const count = await PendingOrder.countDocuments({
      product_type: new ObjectId(
        product_type
      ),
      createdBy: new ObjectId(
        userId
      ),
      createdOn: {
        $gte: today,
      },
      status: "Pending",
      sub_product_id: new ObjectId(id)
    })

    const myTodaysTrade = await PendingOrder.aggregate([
      {
        $match: {
          product_type: new ObjectId(
            product_type
          ),
          createdBy: new ObjectId(
            userId
          ),
          createdOn: {
            $gte: today,
          },
          status: "Pending",
          sub_product_id: new ObjectId(id)
        },
      },
      {
        $project: {
          symbol: 1,
          _id: 1,
          buyOrSell: 1,
          Quantity: 1,
          execution_price: 1,
          price: 1,
          execution_time: 1,
          amount: {
            $multiply: [
              "$price",
              "$Quantity",
            ],
          },
          type: 1,
          status: 1,
          symbol: 1,
          time: "$createdOn",
          instrumentToken: 1,
          exchangeInstrumentToken: 1
        },
      },
      {
        $sort:
        {
          time: -1,
        },
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ])

    const totalQuantity = await PendingOrder.aggregate([
      {
        $match: {
          product_type: new ObjectId(
            product_type
          ),
          createdBy: new ObjectId(
            userId
          ),
          createdOn: {
            $gte: today,
          },
          status: "Pending",
          sub_product_id: new ObjectId(id)
        },
      },
      {
        $group: {
          _id: {
            type: "$type",
            symbol: "$symbol"
          },
          totalQuantity: {
            $sum: "$Quantity", // Assuming "amount" is the field you want to sum
          },
        },
      },
      {
        $project: {
          _id: 0,
          type: "$_id.type",
          quantity: "$totalQuantity",
          symbol: "$_id.symbol"
        }
      }
    ])

    // res.status(200).json({ status: 'success', data: myTodaysTrade, count: count || 0 });

    res.status(200).json({ status: 'success', data: myTodaysTrade, count: count || 0, quantity: totalQuantity || [] });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

exports.cancelOrder = async (req, res, next) => {
  const { id, from } = req.params;

  let pnlData;

  try {
    const updatedOrder = await PendingOrder.findOne(
      { _id: new ObjectId(id) },
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (updatedOrder.status !== "Pending") {
      return res.status(404).json({ message: "Order not found" });
    }

    data = await client.get('stoploss-stopprofit');
    data = JSON.parse(data);
    console.log(data)
    let symbolArr = data[`${updatedOrder.instrumentToken}`];
    for (let i = 0; i < symbolArr.length; i++) {
      if (symbolArr[i]?._id?.toString() === id.toString() &&
        symbolArr[i]?.createdBy?.toString() === updatedOrder.createdBy.toString()) {
        updatedOrder.status = "Cancelled";
        updatedOrder.execution_time = new Date();
        updatedOrder.execution_price = 0;
        const doc = await updatedOrder.save({ new: true });

        if (from === tenxTrader) {
          pnlData = await client.get(`${symbolArr[i]?.createdBy?.toString()}${symbolArr[i]?.sub_product_id?.toString()}: overallpnlTenXTrader`)
        } else if (from === marginx) {
          pnlData = await client.get(`${symbolArr[i]?.createdBy?.toString()}${symbolArr[i]?.sub_product_id?.toString()} overallpnlMarginX`)
        } else if (from === dailyContest) {
          pnlData = await client.get(`${symbolArr[i]?.createdBy?.toString()}${symbolArr[i]?.sub_product_id?.toString()} overallpnlDailyContest`)
        } else if (from === internTrader) {
          pnlData = await client.get(`${symbolArr[i]?.createdBy?.toString()}${symbolArr[i]?.sub_product_id?.toString()}: overallpnlIntern`)
        } else if (from === virtualTrader) {
          pnlData = await client.get(`${symbolArr[i]?.createdBy?.toString()}: overallpnlPaperTrade`)
        } else if (from === stock) {
          symbolArr[i]?.Product === "MIS" ?
            pnlData = await client.get(`${symbolArr[i]?.createdBy?.toString()}: overallpnlIntraday`)
            :
            pnlData = await client.get(`${symbolArr[i]?.createdBy?.toString()}: overallpnlDelivery`)
        }

        pnlData = JSON.parse(pnlData)
        for (let elem of pnlData) {
          console.log("pnl dtata", elem, pnlData)
          const buyOrSell = elem.lots > 0 ? "BUY" : "SELL";
          if (elem._id.symbol === symbolArr[i]?.symbol && elem._id.isLimit && buyOrSell === symbolArr[i]?.buyOrSell) {

            console.log("in if", elem)
            if (Math.abs(elem.lots) > Math.abs(symbolArr[i]?.Quantity)) {
              console.log("in if greater", elem)
              elem.margin = elem.margin - (elem.margin * Math.abs(symbolArr[i]?.Quantity) / Math.abs(elem.lots));
              elem.lots = Math.abs(elem.lots) - Math.abs(symbolArr[i]?.Quantity);
              elem.lots = buyOrSell === "SELL" ? -elem.lots : elem.lots;
              break;
            } else if (Math.abs(elem.lots) === Math.abs(symbolArr[i]?.Quantity)) {
              console.log("in if equal", elem)
              elem.margin = 0;
              elem.lots = Math.abs(elem.lots) - Math.abs(symbolArr[i]?.Quantity);
              break;
            }
          }
        }

        if (from === tenxTrader) {
          await client.set(`${symbolArr[i]?.createdBy?.toString()}${symbolArr[i]?.sub_product_id?.toString()}: overallpnlTenXTrader`, JSON.stringify(pnlData))
        } else if (from === marginx) {
          await client.set(`${symbolArr[i]?.createdBy?.toString()}${symbolArr[i]?.sub_product_id?.toString()} overallpnlMarginX`, JSON.stringify(pnlData))
        } else if (from === dailyContest) {
          await client.set(`${symbolArr[i]?.createdBy?.toString()}${symbolArr[i]?.sub_product_id?.toString()} overallpnlDailyContest`, JSON.stringify(pnlData))
        } else if (from === internTrader) {
          await client.set(`${symbolArr[i]?.createdBy?.toString()}${symbolArr[i]?.sub_product_id?.toString()}: overallpnlIntern`, JSON.stringify(pnlData))
        } else if (from === virtualTrader) {
          await client.set(`${symbolArr[i]?.createdBy?.toString()}: overallpnlPaperTrade`, JSON.stringify(pnlData))
        } else if (from === stock) {
          symbolArr[i]?.Product === "MIS" ?
            await client.set(`${symbolArr[i]?.createdBy?.toString()}: overallpnlIntraday`, JSON.stringify(pnlData))
            :
            await client.set(`${symbolArr[i]?.createdBy?.toString()}: overallpnlDelivery`, JSON.stringify(pnlData))
        }
        // await client.set(`${symbolArr[i]?.createdBy?.toString()}${symbolArr[i]?.sub_product_id?.toString()}: overallpnlTenXTrader`, JSON.stringify(pnlData));
        symbolArr.splice(i, 1, {});
        await client.set('stoploss-stopprofit', JSON.stringify(data));
        break;
      }
    }

    return res.status(200).json({ status: "Success", data: updatedOrder });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message });
  }
};

exports.editPrice = async (req, res, next) => {
  const { id } = req.params;
  let { execution_price } = req.body;

  execution_price = Math.abs(execution_price);
  // console.log(id, execution_price)

  try {
    const updatedOrder = await PendingOrder.findOne(
      { _id: new ObjectId(id) },
    );

    const margin = await fundCheck(updatedOrder, execution_price);

    if (!margin && updatedOrder.type === 'Limit') {
      return res.status(422).json({ status: "error", error: "You do not have sufficient funds to take this trade at this price." });
    }

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (updatedOrder.status !== "Pending") {
      return res.status(404).json({ message: "Order not found" });
    }



    data = await client.get('stoploss-stopprofit');
    data = JSON.parse(data);
    let symbolArr = data[`${updatedOrder.instrumentToken}`];
    for (let i = 0; i < symbolArr.length; i++) {
      if (symbolArr[i]?._id?.toString() === id.toString() &&
        symbolArr[i]?.createdBy?.toString() === updatedOrder.createdBy.toString()) {
        updatedOrder.price = execution_price;
        updatedOrder.margin = margin;
        const doc = await updatedOrder.save({ new: true });
        symbolArr[i].price = execution_price;
        symbolArr[i].margin = margin;

        await client.set('stoploss-stopprofit', JSON.stringify(data));

        break;
      }
    }

    return res.status(200).json({ status: "Success", data: updatedOrder });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.modifyOrder = async (req, res, next) => {
  try {
    const { stopLossQuantity, stopProfitQuantity, symbol, from } = req.body;

    if (from === stock) {
      const check = await checkStockModifyQuantity(req.body, req.user._id);
      if(!check){
        const showPrice = (stopLossQuantity && stopProfitQuantity) ? `${stopLossQuantity} stoploss and ${stopProfitQuantity} stopprofit quantity`
        : (stopLossQuantity) ? `${stopLossQuantity} quantity of stoploss`
        : (stopProfitQuantity) && `${stopProfitQuantity} quantity of stopprofit`
        return res.status(406).send({ message: `You can not modify ${showPrice}`});
      }
    } else {
      const maxLot = symbol.includes("BANK") ? maxLot_BankNifty : symbol.includes("FIN") ? maxLot_FinNifty : maxLot_Nifty;
      if ((stopLossQuantity > maxLot) || (stopProfitQuantity > maxLot)) {
        return res.status(406).send({ message: `You can place maximum ${maxLot} quantity in this trade.` });
      }
    }

    const result = await applyingSLSP(req, {}, null, null, from);

    return res.status(200).json({ status: "Success", message: `Your SL/SP-M order placed for ${req.body.symbol}` });

  } catch (err) {
    console.log(err)
    return res.status(200).json({ status: "Error", message: "Something went wrong." });

  }

};

const checkStockModifyQuantity = async (data, userId) =>{
  const {product_type, id, Product, symbol, stopLossQuantity, stopProfitQuantity} = data;
  const isRedisConnected = getValue();
  let todayPnlData;
  const date = new Date();

  if (Product === "MIS") {
    if (isRedisConnected && (await client.exists(`${userId.toString()}: overallpnlIntraday`))) {
      todayPnlData = await client.get(`${userId.toString()}: overallpnlIntraday`);
      todayPnlData = JSON.parse(todayPnlData);
    }
  }

  if (Product === "CNC") {
    if (isRedisConnected && (await client.exists(`${userId.toString()}: overallpnlDelivery`))) {
      todayPnlData = await client.get(`${userId.toString()}: overallpnlDelivery`);
      todayPnlData = JSON.parse(todayPnlData);
    }
  }

  let filterSymbol = todayPnlData.filter((elem) => {
    return (elem?._id?.symbol === symbol)
  })

  const lots = filterSymbol[0]?.lots;

  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  const totalQuantity = await PendingOrder.aggregate([
    {
      $match: {
        product_type: new ObjectId(
          product_type
        ),
        createdBy: new ObjectId(
          userId
        ),
        createdOn: {
          $gte: today,
        },
        status: "Pending",
        sub_product_id: new ObjectId(id)
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
          symbol: "$symbol"
        },
        totalQuantity: {
          $sum: "$Quantity", // Assuming "amount" is the field you want to sum
        },
      },
    },
    {
      $project: {
        _id: 0,
        type: "$_id.type",
        quantity: "$totalQuantity",
        symbol: "$_id.symbol"
      }
    }
  ])

  const instrumentsPendingOrder = totalQuantity.filter((elem) => {
    return elem.symbol === symbol;
  })

  const slPendingQuantity = instrumentsPendingOrder?.reduce((acc, item) => {
    return item.type === "StopLoss" ? acc + item.quantity : acc;
  }, 0);

  const spPendingQuantity = instrumentsPendingOrder?.reduce((acc, item) => {
    return item.type === "StopProfit" ? acc + item.quantity : acc;
  }, 0)

  // console.log(stopLossQuantity, slPendingQuantity, lots, stopProfitQuantity, spPendingQuantity)
  if(stopLossQuantity && stopProfitQuantity){
    return (lots - slPendingQuantity - stopLossQuantity) >= 0 && (lots - spPendingQuantity - stopProfitQuantity) >= 0;
  } else if(stopLossQuantity){
    return (lots - slPendingQuantity - stopLossQuantity) >= 0;
  } else if(stopProfitQuantity){
    return (lots - spPendingQuantity - stopProfitQuantity) >= 0;
  }
}

const calculateRequiredMargin = async (data, kiteData, price) => {
  const { exchange, symbol, buyOrSell, variety, Product, order_type, Quantity } = data;

  try {
    if (buyOrSell === "SELL") {
      let auth = 'token ' + kiteData.getApiKey + ':' + kiteData.getAccessToken;
      let headers = {
        'X-Kite-Version': '3',
        'Authorization': auth,
        "content-type": "application/json"
      }
      let orderData = [{
        "exchange": exchange,
        "tradingsymbol": symbol,
        "transaction_type": buyOrSell,
        "variety": variety,
        "product": Product,
        "order_type": order_type,
        "quantity": Quantity,
        "price": price ? price : 0,
        "trigger_price": 0
      }]
      const marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, { headers: headers })
      const zerodhaMargin = marginData.data.data.orders[0].total;

      return zerodhaMargin;
    } else {
      if (order_type === "LIMIT") {
        return (price * Math.abs(Quantity));
      }
    }
  } catch (err) {
    console.log(err);
  }

}

const availableMarginFunc = async (fundDetail, pnlData, npnl) => {

  try {
    const openingBalance = fundDetail?.openingBalance ? fundDetail?.openingBalance : fundDetail?.totalFund;
    const withoutLimitData = pnlData.filter((elem) => !elem._id.isLimit);
    if (!pnlData.length) {
      return openingBalance;
    }

    let totalMargin = 0
    let runningLots = 0;
    let amount = 0;
    let margin = 0;
    let subtractAmount = 0;
    for (let acc of pnlData) {
      totalMargin += acc.margin;
      runningLots += acc.lots;
      if (acc._id.isLimit) {
        margin += acc.margin;
      } else {
        if (acc?.lots < 0) {
          margin += acc?.margin;
          subtractAmount += Math.abs(acc?.lots * acc?.lastaverageprice);
        }
        amount += (acc.amount - acc.brokerage)
      }
    }
    if (npnl < 0)
      // substract npnl for those positions only which are closed
      if (runningLots === 0) {
        return openingBalance - totalMargin + npnl;
      } else {
        console.log("margin", openingBalance - (Math.abs(amount - subtractAmount) + margin))
        return openingBalance - (Math.abs(amount - subtractAmount) + margin);
      }
    else {
      return openingBalance - totalMargin;
    }
  } catch (error) {
    console.log(error);
  }

}

const calculateNetPnl = async (modifyData, pnlData, data) => {

  try {
    const { exchange, symbol, instrumentToken } = modifyData;
    // console.log("pnlData", pnlData)
    let addUrl = 'i=' + exchange + ':' + symbol;
    pnlData.forEach((elem) => {
      if (elem?.lots > 0) {
        addUrl += ('&i=' + elem._id.exchange + ':' + elem._id.symbol);
      }
    });

    let url = `https://api.kite.trade/quote/ltp?${addUrl}`;
    const api_key = data.getApiKey;
    const access_token = data.getAccessToken;
    let auth = 'token' + api_key + ':' + access_token;
    let authOptions = {
      headers: {
        'X-Kite-Version': '3',
        Authorization: auth,
      },
    };

    const arr = [];
    const response = await axios.get(url, authOptions);

    for (let instrument in response.data.data) {
      let obj = {};
      obj.last_price = response.data.data[instrument].last_price;
      obj.instrument_token = response.data.data[instrument].instrument_token;
      arr.push(obj);
    }

    let totalNetPnl = 0
    let totalBrokerage = 0
    let totalGrossPnl = 0


    const ltp = arr.filter((subelem) => {
      return subelem?.instrument_token == instrumentToken;
    })

    for (let elem of pnlData) {
      const ltp = arr.filter((subelem) => {
        return subelem?.instrument_token == elem?._id?.instrumentToken;
      })
      if (!elem._id.isLimit) {
        let grossPnl = elem?.lots > 0 ? (elem?.amount + (elem?.lots) * ltp[0]?.last_price) : elem?.amount;
        // console.log("grossPnl", grossPnl)
        totalGrossPnl += grossPnl;
        totalBrokerage += Number(elem?.brokerage);
      }
    }

    totalNetPnl = totalGrossPnl - totalBrokerage;

    return totalNetPnl;
  } catch (err) {
    console.log(err)
  }
}

const fundCheck = async (modifyData, price) => {
  try {
    const { product_type, createdBy, sub_product_id, Quantity, symbol, buyOrSell, Product } = modifyData;
    const isRedisConnected = getValue();
    let todayPnlData;
    let fundDetail;
    try {

      if (product_type?.toString() === "6517d3803aeb2bb27d650de0") {
        if (isRedisConnected && await client.exists(`${createdBy?.toString()}${sub_product_id?.toString()}: overallpnlTenXTrader`)) {
          todayPnlData = await client.get(`${createdBy?.toString()}${sub_product_id?.toString()}: overallpnlTenXTrader`)
          todayPnlData = JSON.parse(todayPnlData);
        }

        if (isRedisConnected && await client.exists(`${createdBy?.toString()}${sub_product_id?.toString()} openingBalanceAndMarginTenx`)) {
          fundDetail = await client.get(`${createdBy?.toString()}${sub_product_id?.toString()} openingBalanceAndMarginTenx`)
          fundDetail = JSON.parse(fundDetail);
          // req.body.portfolioId = fundDetail?.portfolioId;
        }
      } else if (product_type?.toString() === "6517d40e3aeb2bb27d650de1") {
        if (isRedisConnected && await client.exists(`${createdBy?.toString()}${sub_product_id?.toString()} overallpnlMarginX`)) {
          todayPnlData = await client.get(`${createdBy?.toString()}${sub_product_id?.toString()} overallpnlMarginX`)
          todayPnlData = JSON.parse(todayPnlData);
        }

        if (isRedisConnected && await client.exists(`${createdBy?.toString()}${sub_product_id?.toString()} openingBalanceAndMarginMarginx`)) {
          fundDetail = await client.get(`${createdBy?.toString()}${sub_product_id?.toString()} openingBalanceAndMarginMarginx`)
          fundDetail = JSON.parse(fundDetail);
        }
      } else if (product_type?.toString() === "6517d48d3aeb2bb27d650de5") {
        if (isRedisConnected && await client.exists(`${createdBy?.toString()}${sub_product_id?.toString()} overallpnlDailyContest`)) {
          todayPnlData = await client.get(`${createdBy?.toString()}${sub_product_id?.toString()} overallpnlDailyContest`)
          todayPnlData = JSON.parse(todayPnlData);
        }

        if (isRedisConnected && await client.exists(`${createdBy?.toString()}${sub_product_id?.toString()} openingBalanceAndMarginDailyContest`)) {
          fundDetail = await client.get(`${createdBy?.toString()}${sub_product_id?.toString()} openingBalanceAndMarginDailyContest`)
          fundDetail = JSON.parse(fundDetail);
        }
      } else if (product_type?.toString() === "6517d46e3aeb2bb27d650de3") {
        if (isRedisConnected && await client.exists(`${createdBy?.toString()}${sub_product_id?.toString()}: overallpnlIntern`)) {
          todayPnlData = await client.get(`${createdBy?.toString()}${sub_product_id?.toString()}: overallpnlIntern`)
          todayPnlData = JSON.parse(todayPnlData);
        }

        if (isRedisConnected && await client.exists(`${createdBy?.toString()}${sub_product_id?.toString()} openingBalanceAndMarginInternship`)) {
          fundDetail = await client.get(`${createdBy?.toString()}${sub_product_id?.toString()} openingBalanceAndMarginInternship`)
          fundDetail = JSON.parse(fundDetail);
          // req.body.portfolioId = fundDetail?.portfolioId;
        }
      } else if (product_type?.toString() === "65449ee06932ba3a403a681a") {
        if (isRedisConnected && await client.exists(`${createdBy?.toString()}: overallpnlPaperTrade`)) {
          todayPnlData = await client.get(`${createdBy?.toString()}: overallpnlPaperTrade`)
          todayPnlData = JSON.parse(todayPnlData);
        }

        if (isRedisConnected && await client.exists(`${createdBy?.toString()} openingBalanceAndMarginPaper`)) {
          fundDetail = await client.get(`${createdBy?.toString()} openingBalanceAndMarginPaper`)
          fundDetail = JSON.parse(fundDetail);
        }
      } else if (product_type?.toString() === "6583c2012ef31a319cf888c9") {
        if (Product === "MIS") {
          if (isRedisConnected && (await client.exists(`${createdBy?.toString()}: overallpnlIntraday`))) {
            todayPnlData = await client.get(`${createdBy?.toString()}: overallpnlIntraday`);
            todayPnlData = JSON.parse(todayPnlData);
          } else {
            todayPnlData = await pnlPositionDatabase(createdBy)
          }
        }

        if (Product === "CNC") {
          if (isRedisConnected && (await client.exists(`${createdBy.toString()}: overallpnlDelivery`))) {
            todayPnlData = await client.get(`${createdBy.toString()}: overallpnlDelivery`);
            todayPnlData = JSON.parse(todayPnlData);
          } else {
            todayPnlData = await pnlHoldingDatabase(createdBy)
          }
        }

        if (isRedisConnected && await client.exists(`${createdBy.toString()} openingBalanceAndMarginStock`)) {
          fundDetail = await client.get(`${createdBy.toString()} openingBalanceAndMarginStock`)
          fundDetail = JSON.parse(fundDetail);
        } else {
          fundDetail = await marginDetailDataBase(createdBy);
        }
      }

      if (!todayPnlData) {
        return;
      }
    } catch (e) {
      console.log("errro fetching pnl 2", e);
    }

    if (modifyData.type !== "Limit") {
      return modifyData.margin;
    }

    const data = await getKiteCred.getAccess();
    const netPnl = await calculateNetPnl(modifyData, todayPnlData, data);
    const availableMargin = await availableMarginFunc(fundDetail, todayPnlData, netPnl);
    const requiredMargin = await calculateRequiredMargin(modifyData, data, price)

    if (((availableMargin + (modifyData.margin)) - requiredMargin) > 0) {
      for (let elem of todayPnlData) {
        const buyOrSellPnl = elem.lots > 0 ? "BUY" : "SELL";
        if (elem?._id?.isLimit && (elem?._id?.symbol === symbol) && (buyOrSellPnl === buyOrSell)) {
          //marginPrevData is the margin without editing instrument margin, we are subtracting it.
          const marginPrevData = elem?.margin - modifyData.margin;
          elem.margin = marginPrevData + requiredMargin;
          break;
        }
      }

      console.log(todayPnlData)

      if (product_type?.toString() === "6517d3803aeb2bb27d650de0") {
        await client.set(`${createdBy?.toString()}${sub_product_id?.toString()}: overallpnlTenXTrader`, JSON.stringify(todayPnlData))
      } else if (product_type?.toString() === "6517d40e3aeb2bb27d650de1") {
        await client.set(`${createdBy?.toString()}${sub_product_id?.toString()} overallpnlMarginX`, JSON.stringify(todayPnlData))
      } else if (product_type?.toString() === "6517d48d3aeb2bb27d650de5") {
        await client.set(`${createdBy?.toString()}${sub_product_id?.toString()} overallpnlDailyContest`, JSON.stringify(todayPnlData))
      } else if (product_type?.toString() === "6517d46e3aeb2bb27d650de3") {
        await client.set(`${createdBy?.toString()}${sub_product_id?.toString()}: overallpnlIntern`, JSON.stringify(todayPnlData))
      } else if (product_type?.toString() === "65449ee06932ba3a403a681a") {
        await client.set(`${createdBy?.toString()}: overallpnlPaperTrade`, JSON.stringify(todayPnlData))
      } else if (product_type?.toString() === "6583c2012ef31a319cf888c9") {
        await client.set(`${createdBy?.toString()}: ${Product === "MIS" ? "overallpnlIntraday" : "overallpnlDelivery"}`, JSON.stringify(todayPnlData))
      }
      return requiredMargin;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e)
  }
}
