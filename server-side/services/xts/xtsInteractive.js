const XTSInteractive = require('xts-interactive-api').Interactive;
const XTSInteractiveWS = require('xts-interactive-api').WS;
const RetrieveOrder = require("../../models/TradeDetails/retreiveOrder")
const io = require('../../marketData/socketio');
const { xtsAccountType } = require("../../constant");
const { client } = require('../../marketData/redisClient');
const InfinityLiveTrader = require("../../models/TradeDetails/infinityLiveUser");
const InfinityLiveCompany = require("../../models/TradeDetails/liveTradeSchema");
const InfinityMockTrader = require("../../models/mock-trade/infinityTrader");
const InfinityMockCompany = require("../../models/mock-trade/infinityTradeCompany");
const BrokerageDetail = require("../../models/Trading Account/brokerageSchema");
const mongoose = require('mongoose');
const { save } = require("./xtsHelper/saveXtsCred");



let xtsInteractiveWS;
let xtsInteractiveAPI;
const interactiveLogin = async () => {
  xtsInteractiveAPI = new XTSInteractive(
    process.env.INTERACTIVE_URL
  );

  xtsInteractiveWS = new XTSInteractiveWS(
    process.env.INTERACTIVE_URL
  );
  console.log("xtsInteractiveAPI", xtsInteractiveAPI)
  let loginRequest = {
    secretKey: process.env.INTERACTIVE_SECRET_KEY,
    appKey: process.env.INTERACTIVE_APP_KEY,
  };

  try {
    (async () => {
      console.log(loginRequest, process.env.INTERACTIVE_URL)
      let logIn = await xtsInteractiveAPI.logIn(loginRequest);
      console.log(logIn)
      let socketInitRequest = {
        userID: process.env.XTS_USERID,
        publishFormat: 'JSON',
        broadcastMode: 'Full',
        token: logIn?.result?.token
      };
      xtsInteractiveWS.init(socketInitRequest);

      xtsInteractiveWS.onConnect((connectData) => {
        console.log("socket connection", connectData);
      });

      xtsInteractiveWS.onJoined((joinedData) => {
        console.log("joinedData", joinedData);
      });

      await save(logIn?.result?.userID, logIn?.result?.token, "Interactive")

    })();
  } catch (err) {
    console.log(err);
  }

}

const placeOrder = async (obj, req, res) => {
  let exchangeSegment;
  if (obj.exchange === "NFO") {
    exchangeSegment = 'NSEFO'
  }
  if (obj.exchange === "NSE") {
    exchangeSegment = 'NSECM'
  }
  const response = await xtsInteractiveAPI.placeOrder({
    exchangeSegment: exchangeSegment,
    exchangeInstrumentID: obj.exchangeInstrumentToken,
    productType: obj.Product,
    orderType: obj.OrderType,
    orderSide: obj.buyOrSell,
    timeInForce: obj.validity,
    disclosedQuantity: 0,
    orderQuantity: obj.Quantity,
    limitPrice: 0,
    stopPrice: 0,
    clientID: process.env.XTS_CLIENTID,
  });

  // console.log(response);

  if (response?.result?.AppOrderID) {
    await getPlacedOrderAndSave(false, req, res, response?.result?.AppOrderID);
  }
  // await positions();


  return response;
  // 
}
// wrap in if condition, placeorder orderid and orderData orderid must be equal
const getPlacedOrderAndSave = async (isDataSaved, req, res, orderId) => {
  console.log("first", isDataSaved)
  xtsInteractiveWS.onOrder(async (orderData) => {
    console.log("second", isDataSaved)
    if (isDataSaved) {
      return;
    }

    if (orderId === orderData.AppOrderID) {
      let date = new Date();
      let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      todayDate = todayDate + "T23:59:59.999Z";
      const today = new Date(todayDate);
      const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);

      let { algoBoxId, exchange, symbol, buyOrSell, Quantity, variety, trader, validity, 
        instrumentToken, dontSendResp, exchangeInstrumentToken, Product } = req.body

      if (exchange === "NFO") {
        exchangeSegment = 2;
      }

      const brokerageDetailBuy = await BrokerageDetail.find({ transaction: "BUY", accountType: xtsAccountType });
      const brokerageDetailSell = await BrokerageDetail.find({ transaction: "SELL", accountType: xtsAccountType });


      console.log("order data", orderData.OrderStatus);
      let { ClientID, AppOrderID, ExchangeOrderID, ExchangeInstrumentID, OrderSide, OrderType, ProductType,
        TimeInForce, OrderPrice, OrderQuantity, OrderStatus, OrderAverageTradedPrice, OrderDisclosedQuantity,
        ExchangeTransactTime, LastUpdateDateTime, CancelRejectReason, ExchangeTransactTimeAPI } = orderData;


      const exchangeTime = ExchangeTransactTimeAPI;
      const date1 = exchangeTime.split(" ");
      const date2 = date1[0].split("-");
      const date3 = `${date2[2]}-${date2[1]}-${date2[0]} ${date1[1]}`

      const utcDate = new Date(date3).toUTCString();

      console.log("exchange timming", new Date(utcDate));

      const session = await mongoose.startSession();

      console.log("session")

      try {
        if (OrderStatus === "Rejected" || OrderStatus === "Filled") {
          let status, transaction_type;
          session.startTransaction();
          if (OrderStatus === "Rejected") {
            status = "REJECTED";
          } else if (OrderStatus === "Filled") {
            status = "COMPLETE";
          }

          if (OrderSide == "Sell") {
            transaction_type = "SELL";
          } else if (OrderSide == "Buy") {
            transaction_type = "BUY";
          }

          if (!CancelRejectReason) {
            CancelRejectReason = "null"
          }
          if (!ExchangeTransactTime) {
            ExchangeTransactTime = "null"
          }
          if (!ExchangeOrderID) {
            ExchangeOrderID = "null"
          }
          if (!OrderAverageTradedPrice) {
            OrderAverageTradedPrice = 0;
          }

          let responseMsg = status;
          let responseErr = CancelRejectReason;

          if (transaction_type == "SELL") {
            console.log("in if", OrderQuantity);
            OrderQuantity = 0 - OrderQuantity;
            console.log("after if", OrderQuantity);
          }
          if (buyOrSell == "SELL") {
            console.log("in if", Quantity);
            Quantity = 0 - Quantity;
            console.log("after if", Quantity);
          }

          console.log("in check")
          function buyBrokerage(totalAmount) {
            let brokerage = Number(brokerageDetailBuy[0].brokerageCharge);
            let exchangeCharge = totalAmount * (Number(brokerageDetailBuy[0].exchangeCharge) / 100);
            let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailBuy[0].gst) / 100);
            let sebiCharges = totalAmount * (Number(brokerageDetailBuy[0].sebiCharge) / 100);
            let stampDuty = totalAmount * (Number(brokerageDetailBuy[0].stampDuty) / 100);
            let sst = totalAmount * (Number(brokerageDetailBuy[0].sst) / 100);
            let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
            return finalCharge;
          }

          function sellBrokerage(totalAmount) {
            let brokerage = Number(brokerageDetailSell[0].brokerageCharge);
            let exchangeCharge = totalAmount * (Number(brokerageDetailSell[0].exchangeCharge) / 100);
            let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailSell[0].gst) / 100);
            let sebiCharges = totalAmount * (Number(brokerageDetailSell[0].sebiCharge) / 100);
            let stampDuty = totalAmount * (Number(brokerageDetailSell[0].stampDuty) / 100);
            let sst = totalAmount * (Number(brokerageDetailSell[0].sst) / 100);
            let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;

            return finalCharge
          }

          let brokerageCompany;
          let brokerageUser;

          if (transaction_type === "BUY") {
            brokerageCompany = buyBrokerage(Math.abs(Number(OrderQuantity)) * OrderAverageTradedPrice);
          } else {
            brokerageCompany = sellBrokerage(Math.abs(Number(OrderQuantity)) * OrderAverageTradedPrice);
          }

          if (buyOrSell === "BUY") {
            brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * OrderAverageTradedPrice);
          } else {
            brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * OrderAverageTradedPrice);
          }

          console.log("in check 2")



          const retreiveObj = {
            order_id: AppOrderID, status: status, average_price: OrderAverageTradedPrice,
            quantity: OrderQuantity, product: ProductType, transaction_type: transaction_type,
            exchange_order_id: ExchangeOrderID, order_timestamp: LastUpdateDateTime, validity: TimeInForce,
            exchange_timestamp: ExchangeTransactTime, order_type: OrderType, price: OrderPrice,
            disclosed_quantity: OrderDisclosedQuantity, placed_by: ClientID, status_message: CancelRejectReason,
            instrument_token: ExchangeInstrumentID, exchange_update_timestamp: new Date(utcDate), guid: `${ExchangeOrderID}${AppOrderID}`
          };

          const companyDoc = {
            disclosed_quantity: OrderDisclosedQuantity, price: OrderPrice, guid: `${ExchangeOrderID}${AppOrderID}`,
            status, createdBy: req.user._id, average_price: OrderAverageTradedPrice, Quantity: OrderQuantity,
            Product: ProductType, buyOrSell: transaction_type,
            variety, validity: TimeInForce, exchange, order_type: OrderType, symbol, placed_by: ClientID,
            algoBox: algoBoxId, order_id: AppOrderID, instrumentToken, brokerage: brokerageCompany,
            trader: trader, isRealTrade: true, amount: (Number(OrderQuantity) * OrderAverageTradedPrice), trade_time: LastUpdateDateTime,
            exchange_order_id: ExchangeOrderID, exchange_timestamp: ExchangeTransactTime, isMissed: false
          }

          const traderDoc = {
            disclosed_quantity: OrderDisclosedQuantity, price: OrderPrice, guid: `${ExchangeOrderID}${AppOrderID}`,
            status, createdBy: req.user._id, average_price: OrderAverageTradedPrice, Quantity: Quantity,
            Product: ProductType, buyOrSell: buyOrSell,
            variety, validity: TimeInForce, exchange, order_type: OrderType, symbol, placed_by: ClientID,
            order_id: AppOrderID, instrumentToken, brokerage: brokerageUser, trader: trader,
            isRealTrade: true, amount: (Number(Quantity) * OrderAverageTradedPrice), trade_time: LastUpdateDateTime,
            exchange_order_id: ExchangeOrderID, exchange_timestamp: ExchangeTransactTime, isMissed: false
          }

          const companyDocMock = {
            status, average_price: OrderAverageTradedPrice, Quantity: OrderQuantity,
            Product: ProductType, buyOrSell: transaction_type, variety, validity: TimeInForce, exchange, order_type: OrderType,
            symbol, placed_by: ClientID, algoBox: algoBoxId, order_id: AppOrderID,
            instrumentToken, brokerage: brokerageCompany, createdBy: req.user._id,
            trader: trader, isRealTrade: false, amount: (Number(OrderQuantity) * OrderAverageTradedPrice),
            trade_time: LastUpdateDateTime,
          }

          const traderDocMock = {
            status, average_price: OrderAverageTradedPrice, Quantity: Quantity,
            Product: ProductType, buyOrSell,
            variety, validity: TimeInForce, exchange, order_type: OrderType, symbol, placed_by: ClientID,
            isRealTrade: false, order_id: AppOrderID, instrumentToken, brokerage: brokerageUser,
            createdBy: req.user._id, trader: trader, amount: (Number(Quantity) * OrderAverageTradedPrice), trade_time: LastUpdateDateTime,
          }

          const saveOrder = await RetrieveOrder.create([retreiveObj], { session })
          const liveCompanyTrade = await InfinityLiveCompany.create([companyDoc], { session });
          const algoTraderLive = await InfinityLiveTrader.create([traderDoc], { session });
          const mockCompany = await InfinityMockCompany.create([companyDocMock], { session });
          const algoTrader = await InfinityMockTrader.create([traderDocMock], { session })

          let settingRedis;
          if (await client.exists(`${req.user._id.toString()} overallpnl`)) {
            let pnl = await client.get(`${req.user._id.toString()} overallpnl`)
            pnl = JSON.parse(pnl);
            console.log("redis pnl", pnl)
            const matchingElement = pnl.find((element) => (element._id.instrumentToken === algoTrader[0].instrumentToken && element._id.product === algoTrader[0].Product));
            // if instrument is same then just updating value
            if (matchingElement) {
              // Update the values of the matching element with the values of the first document
              matchingElement.amount += (algoTrader[0].amount * -1);
              matchingElement.brokerage += Number(algoTrader[0].brokerage);
              matchingElement.lastaverageprice = algoTrader[0].average_price;
              matchingElement.lots += Number(algoTrader[0].Quantity);

            } else {
              // Create a new element if instrument is not matching
              pnl.push({
                _id: {
                  symbol: algoTrader[0].symbol,
                  product: algoTrader[0].Product,
                  instrumentToken: algoTrader[0].instrumentToken,
                  exchange: algoTrader[0].exchange,
                },
                amount: (algoTrader[0].amount * -1),
                brokerage: Number(algoTrader[0].brokerage),
                lots: Number(algoTrader[0].Quantity),
                lastaverageprice: algoTrader[0].average_price,
              });
            }
            settingRedis = await client.set(`${req.user._id.toString()} overallpnl`, JSON.stringify(pnl))
            console.log("in chek if 3", settingRedis)
            console.log(settingRedis)
          }

          await client.expire(`${req.user._id.toString()} overallpnl`, secondsRemaining);
          // Commit the transaction

          console.log("in chek 3", settingRedis)
          if (settingRedis === "OK") {
            await session.commitTransaction();
          } else {
            throw new Error();
          }


          console.log("data saved in retreive order for", AppOrderID)
          isDataSaved = true;
          if (!dontSendResp) {
            io.emit("updatePnl", liveCompanyTrade)
            return res.status(201).json({ message: responseMsg, err: responseErr })
          }
        }
      } catch (err) {
        await client.del(`${req.user._id.toString()} overallpnl`)
        await session.abortTransaction();

        let exchangeSegment;
        if (exchange === "NFO") {
          exchangeSegment = 'NSEFO'
        }
        if (exchange === "NSE") {
          exchangeSegment = 'NSECM'
        }
        if(OrderSide === "Buy"){
          buyOrSell = "SELL"
        } else{
          buyOrSell = "BUY"
        }
        // console.log(buyOrSell, OrderQuantity)
        const response = await xtsInteractiveAPI.placeOrder({
          exchangeSegment: exchangeSegment,
          exchangeInstrumentID: exchangeInstrumentToken,
          productType: Product,
          orderType: OrderType,
          orderSide: buyOrSell,
          timeInForce: validity,
          disclosedQuantity: 0,
          orderQuantity: Math.abs(OrderQuantity),
          limitPrice: 0,
          stopPrice: 0,
          clientID: process.env.XTS_CLIENTID,
        });

        console.error('Transaction failed, documents not saved:', err, response);
        return res.status(201).json({ message: "Trade Rejected Unexpexctedly. Please Trade Again.", err: "Error" })

      } finally {
        // End the session
        session.endSession();
      }
    }
  });
}

const positions = async () => {
  xtsInteractiveWS.onPosition((positionData) => {
    io.emit('positions', positionData);
    // console.log(positionData);
  });
}


module.exports = { interactiveLogin, placeOrder, positions };


// {
//   LoginID: 'JPKS2',
//   AccountID: 'FPI2',
//   TradingSymbol: 'NIFTY 25MAY2023 PE 17700',
//   ExchangeSegment: 'NSEFO',
//   ExchangeInstrumentID: '73541',
//   ProductType: 'NRML',
//   Multiplier: '1',
//   Marketlot: '50',
//   BuyAveragePrice: '7.55',
//   SellAveragePrice: '7.325',
//   LongPosition: '100',
//   ShortPosition: '100',
//   NetPosition: '0',
//   BuyValue: '755',
//   SellValue: '732.5',
//   NetValue: '-22.5',
//   UnrealizedMTM: '0.00',
//   RealizedMTM: '0.00',
//   MTM: '0.00',
//   BEP: '0.00',
//   SumOfTradedQuantityAndPriceBuy: '755',
//   SumOfTradedQuantityAndPriceSell: '732.5',
//   StatisticsLevel: 'ParentLevel',
//   IsInterOpPosition: false,
//   childPositions: {},
//   MessageCode: 9002,
//   MessageVersion: 1,
//   TokenID: 0,
//   ApplicationType: 0,
//   SequenceNumber: 0
// }