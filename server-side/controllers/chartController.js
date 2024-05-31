const axios = require("axios");
const getKiteCred = require("../marketData/getKiteCred");
const TradableInstrument = require("../models/Instruments/tradableInstrumentsSchema");
const Index = require("../models/StockIndex/stockIndexSchema");
const moment = require("moment");

exports.getHistoricalData = async (req, res) => {
  const { instrumentToken, from, to, interval, continuous, countBack } =
    req.query;
  console.log(req.query);
  const data = await getKiteCred.getAccess();
  // Validate input
  if (!instrumentToken || !from || !to || !interval) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Construct the API endpoint
    const url = `https://api.kite.trade/instruments/historical/${instrumentToken}/${interval}`;

    // Make the API call
    const response = await axios.get(url, {
      params: {
        from: from,
        to: to,
        // continuous: true,
      },
      headers: {
        "X-Kite-Version": "3",
        Authorization: `token ${data.getApiKey}:${data.getAccessToken}`,
      },
    });
    const formattedData = response.data.data.candles.map((candle) => ({
      time: new Date(candle[0]).getTime() / 1000 + 19800,
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
    }));

    // Send the data back to the client
    res.status(200).json({ status: "success", data: formattedData });
  } catch (error) {
    console.error("Error fetching historical data:", error.message, error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching historical data" });
  }
};
exports.getHistoricalDataAdv = async (req, res) => {
  const { instrumentToken, from, to, interval, continuous, countBack } =
    req.query;
  console.log(req.query);
  let fromDate = moment.unix(from);
  const toDate = moment.unix(to);

  // Adjust fromDate if the difference is more than 59 days
  if (toDate.diff(fromDate, "days") > 59) {
    fromDate = toDate.clone().subtract(59, "days");
  }

  // Format the dates as required
  const formattedFromDate = fromDate.format("YYYY-MM-DD HH:mm:ss");
  const formattedToDate = toDate.format("YYYY-MM-DD HH:mm:ss");
  console.log("to from", formattedToDate, formattedFromDate);
  const data = await getKiteCred.getAccess();
  // Validate input
  if (!instrumentToken || !from || !to || !interval) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Construct the API endpoint
    const url = `https://api.kite.trade/instruments/historical/${instrumentToken}/${interval}`;

    // Make the API call
    const response = await axios.get(url, {
      params: {
        from: formattedFromDate,
        to: formattedToDate,
        // continuous: true,
      },
      headers: {
        "X-Kite-Version": "3",
        Authorization: `token ${data.getApiKey}:${data.getAccessToken}`,
      },
    });
    const formattedData = response.data.data.candles.map((candle) => ({
      time: new Date(candle[0]).getTime(),
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
    }));

    // Send the data back to the client
    res.status(200).json({ status: "success", data: formattedData });
  } catch (error) {
    console.error("Error fetching historical data:", error.message, error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching historical data" });
  }
};
exports.getHistoricalDataUDF = async (req, res) => {
  const { instrumentToken, from, to, interval, continuous } = req.query;
  console.log(req.query);
  const data = await getKiteCred.getAccess();
  // Validate input
  if (!instrumentToken || !from || !to || !interval) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Construct the API endpoint
    const url = `https://api.kite.trade/instruments/historical/${instrumentToken}/${interval}`;

    // Make the API call
    const response = await axios.get(url, {
      params: {
        from: from,
        to: to,
        continuous: continuous || false,
      },
      headers: {
        "X-Kite-Version": "3",
        Authorization: `token ${data.getApiKey}:${data.getAccessToken}`,
      },
    });
    const candles = response.data.data.candles.map((candle) => ({
      time: moment(candle[0]).unix(),
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
      volume: candle[5],
    }));

    res.json({
      s: "ok",
      t: candles.map((c) => c.time),
      o: candles.map((c) => c.open),
      h: candles.map((c) => c.high),
      l: candles.map((c) => c.low),
      c: candles.map((c) => c.close),
      v: candles.map((c) => c.volume),
    });
  } catch (error) {
    console.error("Error fetching historical data", error);
    res.status(500).json({ s: "error", errmsg: error.message });
  }
};

exports.getAllSymbols = async (req, res) => {
  try {
    const tradable = await TradableInstrument.find({ status: "Active" });
    const indices = await Index.find({ accountType: "ZERODHA" });
    // console.log("tradable", tradable);
    let allSymbols = [];
    for (let item of tradable) {
      allSymbols.push({
        instrument_token: item?.instrument_token,
        exchange_instrument_token: item?.exchange_token,
        symbol: item?.tradingsymbol,
        full_name: `${item?.tradingsymbol}`,
        description: `${item?.tradingsymbol} - EXP.${moment(
          item?.expiry
        ).format("DD-MMM-YY")}`,
        exchange: item?.exchange,
        type: "Options",
      });
    }
    for (let item of indices) {
      allSymbols.push({
        instrument_token: item?.instrumentToken,
        exchange_instrument_token: item?.exchange_token ?? "NA",
        symbol: item?.instrumentSymbol,
        full_name: `${item?.displayName}`,
        description: `${item?.displayName}`,
        exchange: item?.exchange,
        type: "Stock",
      });
    }
    res.status(200).json({ data: allSymbols });
  } catch (e) {
    console.log(e);
  }
};
