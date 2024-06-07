const moment = require("moment");
const OrganizedData = require("../models/InstrumentHistoricalData/InstrumentHistoricalDataTemp");
const RawData = require("../models/InstrumentHistoricalData/InstrumentHistoricalDataNew");
const csvParser = require("csv-parser");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const RawNewData = require("../models/InstrumentHistoricalData/instrumentHistoricalDataNewRaw");

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

exports.addRawDataFromCSV = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "NSEFO_1hr_may.csv"); // Update this path to your local CSV file
    await readLocalCsvAndInsertToDB(filePath);
    res.send("Data imported successfully");
  } catch (error) {
    console.error("Error importing data:", error);
    res.status(500).send("Error importing data");
  }
};

async function readLocalCsvAndInsertToDB(filePath) {
  const results = [];
  let batchCount = 0;
  const BATCH_SIZE = 1000;

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (data) => {
      const timestamp = new Date(`${data.Date}T${data.Time}`);
      const formattedData = {
        symbol: data.Ticker,
        timestamp,
        open: parseFloat(data.Open),
        high: parseFloat(data.High),
        close: parseFloat(data.Close),
        low: parseFloat(data.Low),
        volume: parseInt(data.Volume, 10),
      };
      results.push(formattedData);

      if (results.length === BATCH_SIZE) {
        RawNewData.insertMany(results.splice(0, BATCH_SIZE))
          .then(() => {
            batchCount++;
            console.log(`Batch ${batchCount} inserted successfully`);
          })
          .catch((error) => {
            console.error(`Error inserting batch ${batchCount}:`, error);
          });
      }
    })
    .on("end", async () => {
      if (results.length > 0) {
        try {
          await RawNewData.insertMany(results);
          console.log("Remaining data inserted successfully");
        } catch (error) {
          console.error("Error inserting remaining data:", error);
        }
      }
      console.log("CSV processing completed");
    });
}
