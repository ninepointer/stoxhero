const axios = require("axios");
const getKiteCred = require("../marketData/getKiteCred");

exports.getHistoricalData = async (req, res) => {
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
