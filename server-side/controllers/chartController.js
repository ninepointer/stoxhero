const axios = require("axios");
const getKiteCred = require("../marketData/getKiteCred");

exports.getHistoricalData = async (req, res) => {
  const { instrumentToken, from, to, interval, continuous } = req.body;
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
        Authorization: `token ${data.getApiKey}:ExRl4t26Z496GUMP1RE4tbl8quSYY9dD`,
      },
    });

    // Send the data back to the client
    res.status(200).json({ status: "success", data: response.data });
  } catch (error) {
    console.error("Error fetching historical data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching historical data" });
  }
};
