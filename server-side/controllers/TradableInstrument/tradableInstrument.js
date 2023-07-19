const axios = require('axios');
const zlib = require('zlib');
const csv = require('csv-parser');
const TradableInstrument = require("../../models/Instruments/tradableInstrumentsSchema")
const getKiteCred = require('../../marketData/getKiteCred'); 


exports.tradableInstrument = async (req,res,next) => {

    let userId = req.user._id;
    getKiteCred.getAccess().then((data)=>{
        console.log(data)
        // createNewTicker(data.getApiKey, data.getAccessToken);
        const url = 'https://api.kite.trade/instruments/NFO';


        const api_key = data.getApiKey;
        const access_token = data.getAccessToken;
        let auth = 'token ' + api_key + ':' + access_token;
    

        // Connection string for MongoDB
        // const connectionString = 'mongodb://localhost:27017/mydatabase';
    
        // Options for the HTTP request
        const options = {
            headers: {
                'X-Kite-Version':'3',
                'Authorization': auth,
                'Accept-Encoding': 'gzip',
            },
            responseType: 'stream',
        };
    

        axios.get(url, options)
        .then((response) => {
            // If the response is gzipped, decompress it
            const unzip = response.headers['content-encoding'] === 'gzip'
            ? response.data.pipe(zlib.createGunzip())
            : response.data;

            console.log("unzip", unzip)
            // Parse the CSV data from the response
            unzip
            .pipe(csv())
            .on('data', async (row) => {

                const existingInstrument = await TradableInstrument.findOne({ tradingsymbol: row.tradingsymbol, status: "Active" });
                console.log("existingInstrument", existingInstrument)
                if (!existingInstrument) {
                  if((row.name == "NIFTY" || row.name == "BANKNIFTY" || row.name == "FINNIFTY") && row.segment == "NFO-OPT"){
                    

                    row.lastModifiedBy = userId;
                    row.createdBy = userId;
                    let date = changeDate(row.expiry);
                    let prefix = "OPTIDX_" + row.name;
                    let type = row.instrument_type;
                    let strike = row.strike;

                    row.chartInstrument = `${prefix}_${date}_${type}_${strike}`;
                    if(row.name === "NIFTY"){
                        row.name = row.name+"50"
                    }
                    console.log("getting row in instrument", row);
                    try{
                        const x = await TradableInstrument.create([row]);
                        console.log(x)
                    } catch(err){
                        console.log(err);
                    }

                  }
                }
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
                res.send('CSV file successfully processed')
            });
        })
        .catch((error) => {
            console.error(error);
        });
    

    });

    // URL to the API


}

function changeDate(dateStr){
    const date = new Date(dateStr);
    
    const months = [
      "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    const formattedDate = `${day}${month}${year}`;
    
    return formattedDate;
  }



