const moment = require("moment");
const OrganizedData = require("../models/InstrumentHistoricalData/InstrumentHistoricalDataTemp");
const RawData = require("../models/InstrumentHistoricalData/InstrumentHistoricalDataNew");

exports.parseDataTemp = async (req, res) => {
  const startDate = moment("2024-04-17").toDate();
  const endDate = moment("2024-04-26").toDate();
  try {
    // Fetch raw data between specified dates
    const rawData = await RawData.find({
      timestamp: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    // Organize data by symbol and date
    const organizedDataMap = {};

    rawData.forEach((data) => {
      const { symbol, timestamp, open, high, close, low, volume } = data;
      const date = moment(timestamp).format("YYYY-MM-DD");

      if (!organizedDataMap[symbol]) {
        organizedDataMap[symbol] = {};
      }
      if (!organizedDataMap[symbol][date]) {
        organizedDataMap[symbol][date] = [];
      }

      organizedDataMap[symbol][date].push({
        timestamp,
        open,
        high,
        close,
        low,
        volume,
      });
    });

    // Prepare documents for insertion
    const organizedDataDocs = [];
    Object.keys(organizedDataMap).forEach((symbol) => {
      Object.keys(organizedDataMap[symbol]).forEach((date) => {
        organizedDataDocs.push({
          symbol,
          instrumentToken: "", // Populate with actual data if available
          exchangeToken: "", // Populate with actual data if available
          expiry: null, // Populate with actual data if available
          candles: organizedDataMap[symbol][date],
          createdOn: moment(date).add(330, "minutes").toDate(),
        });
      });
    });

    // Insert organized data
    await OrganizedData.insertMany(organizedDataDocs);

    res.status(200).send("Data organized and inserted successfully");
  } catch (error) {
    console.error("Error organizing data:", error);
    res.status(500).send("Internal Server Error");
  }
};
