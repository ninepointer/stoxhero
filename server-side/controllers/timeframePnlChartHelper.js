const moment = require("moment");
const ThirdPartyTrades = require("../models/mock-trade/thirdPartyTrades");
const { ObjectId } = require("mongodb");
const multer = require("multer");


exports.convertToTradingDataToGroup = async (data, userId) => {
  console.log('case1')
  try {
    data.sort((a, b) => {
      if (a?.["Trade Date/Time"] > b?.["Trade Date/Time"]) {
        return 1;
      }
      if (a?.["Trade Date/Time"] <= b?.["Trade Date/Time"]) {
        return -1;
      }
    });
    // Step 1: Grouping the data
    const groupedData = {};
    console.log('case2')
    data.forEach((elem) => {
      const groupKey = [
        elem?.["Strike Price"],
        elem?.["Option Type"],
        elem?.["Symbol"],
        elem?.["Buy/Sell"],
        elem?.["Trade Date/Time"],
        elem?.["Contract Name"],
      ].join("|");
      
      if (!groupedData[groupKey]) {
        groupedData[groupKey] = {
          ...elem,
          Quantity: 0,
          totalPrice: 0,
          count: 0,
          amount: 0,
        };
      }

      groupedData[groupKey].Quantity += Number(elem?.["Quantity"].replace(/,/g, ''));
      groupedData[groupKey].totalPrice += Number(elem?.["Price"].replace(/,/g, ''));
      groupedData[groupKey].amount +=
        Number(elem?.["Price"]) * Number(elem?.["Quantity"].replace(/,/g, ''));
      groupedData[groupKey].count += 1;
    });

    // Step 2: Converting the grouped data to the required format
    const tradeData = [];
    for (const key in groupedData) {
      console.log('case3')
      const elem = groupedData[key];
      // const avgPrice = Number(elem.totalPrice / elem.count)
      const avgPrice = Math.round((elem.totalPrice / elem.count) * 100) / 100;
      let checkOption = false;
      let checkFuture = false;
      let checkStock = false;
      if (elem?.["Option Type"] == "CE" || elem?.["Option Type"] == "PE") {
        checkOption = true;
      }

      if (elem?.["Option Type"] == "FX") {
        checkFuture = true;
      }

      if (elem?.['Instrument Type'] === 'EQ') {
        checkStock = true;
      }

      let instrument;
      if (checkFuture) {
        const newExpiry = moment(elem?.["Expiry Date"], "DD MMMM YYYY")
          .clone()
          .format("DDMMMYY");
        instrument = `${elem?.["Symbol"]}${newExpiry?.toUpperCase()}FUT`;
      }
      if (checkOption) {
        const newExpiry = moment(elem?.["Expiry Date"], "DD MMMM YYYY")
          .clone()
          .format("DDMMMYY");
        instrument = `${elem?.["Symbol"]}${newExpiry?.toUpperCase()}${elem?.["Strike Price"]
          }${elem?.["Option Type"]}`;
      }

      if (checkStock) {
        instrument = elem?.["Symbol"]
      }

      let buyOrSell;
      let quantity=0;
      let amount = 0;
      if (elem?.["Buy/Sell"] === "2") {
        buyOrSell = "SELL";
        quantity = 0 - elem.Quantity;
        // amount = avgPrice * quantity;
        amount = 0 - elem?.amount;
      } else {
        buyOrSell = "BUY";
        quantity = elem.Quantity;
        // amount = avgPrice * quantity;
        amount = elem?.amount;
      }

      // console.log(quantity, amount, moment(elem?.['Trade Date/Time'], "DD MMMM YYYY HH:mm:ss").add(5, 'hours').add(30, 'minutes').utc().format())
      tradeData.push({
        order_id: elem["Trade Id"],
        status: "COMPLETE",
        average_price: avgPrice,
        Quantity: quantity,
        buyOrSell,
        exchange: "NFO",
        symbol: instrument,
        amount: amount,
        brokerage: Math.abs(Number(amount)*0.001),
        // trade_time: moment(elem?.["Trade Date/Time"], "DD MMMM YYYY HH:mm:ss"),
        trade_time: moment(elem?.['Trade Date/Time'], "DD MMMM YYYY HH:mm:ss").add(5, 'hours').add(30, 'minutes').utc().format(),
        account_number: elem?.["Account Number"],
        cp_id: elem?.["CP ID"],
        ctcl_id: elem?.["CTCL ID"],
        user_id: elem?.["User Id"],
        // modify_date: moment(
        //   elem?.["Modified Date/Time"],
        //   "DD MMMM YYYY HH:mm:ss"
        // ),
        modify_date: moment(elem?.["Modified Date/Time"], "DD MMMM YYYY HH:mm:ss").add(30, 'minutes').utc().format(),
        trader: userId,
        createdOn: new Date(),
        createdBy: userId,
      });
    }


    console.log('case4')

    const getStartDate = moment(tradeData?.[0]?.trade_time)
      .startOf("day")
      .add(5, "hours")
      .add(30, "minutes");
    const getEndDate = moment(tradeData?.[0]?.trade_time)
      .endOf("day")
      .add(5, "hours")
      .add(30, "minutes");

    const checkExist = await ThirdPartyTrades.findOne({
      trader: new ObjectId(userId),
      order_id: tradeData?.[0]?.order_id,
      trade_time: { $gt: new Date(getStartDate), $lt: new Date(getEndDate) },
    });

    if (checkExist) {
      return "Data Exist";
    }

    await ThirdPartyTrades.create(tradeData);

    // Grouping the data
    const finalgroupedData = tradeData.reduce((acc, trade) => {
      // Extract the date part from trade_time
      const tradeDate = moment(trade.trade_time).format('YYYY-MM-DD');
      console.log('case5')
      // Create a key using symbol and tradeDate
      const key = `${trade.symbol}_${tradeDate}`;

      // If the key doesn't exist in the accumulator, initialize it with an empty array
      if (!acc[key]) {
        acc[key] = [];
      }

      // Push the current trade to the appropriate group
      acc[key].push(trade);

      return acc;
    }, {});

    console.log('case6')
    return (finalgroupedData);

  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};