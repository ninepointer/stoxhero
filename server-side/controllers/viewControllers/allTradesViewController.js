const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const PaperTrade = require('../../models/mock-trade/paperTrade');
const User = require('../../models/User/userDetailSchema')
const InternshipTrader = require('../../models/mock-trade/internshipTrade');
const { ObjectId } = require('mongodb');
const stagingDB = process.env.STAGINGDB;
const client = new MongoClient(stagingDB, { useUnifiedTopology: true });


// Define the schema for the view
// const tradeViewSchema = new mongoose.Schema({
//     _id: mongoose.Schema.Types.Mixed,
//     trader: mongoose.Schema.Types.ObjectId,
// });

// Create a Mongoose model for the view
// const TradeView = mongoose.model('all-trades-view', tradeViewSchema);

// Function to create the view
// Function to create the view and count documents
exports.createTradeView = async (req, res, next) => {
    try {
        await client.connect();
        // Define the pipeline for the view
        const pipeline = [
            {
              $unionWith: {
                coll: "intern-trades",
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      trader: 1,
                    },
                  },
                ],
              },
            },
            {
                $unionWith: {
                  coll: "tenx-trade-users",
                  pipeline: [
                    {
                      $project: {
                        _id: 1,
                        trader: 1,
                      },
                    },
                  ],
                },
              },
              {
                $unionWith: {
                  coll: "dailycontest-mock-users",
                  pipeline: [
                    {
                      $project: {
                        _id: 1,
                        trader: 1,
                      },
                    },
                  ],
                },
              },
          ]
    
        const db = client.db(); 
        // Create the view
        // await db.createView('all_trades_views', 'paper-trades', pipeline);
        await db.collection('paper-trades').aggregate(pipeline).out('all_trades_views').toArray();
        // await db.collection('intern-trades').aggregate(pipeline).out('all_trades_views').toArray();
        const view = db.collection('all_trades_views');
        const traderPipeline = [
            {
              $group: {
                _id: null,
                uniqueTraders: { $addToSet: '$trader' }
              },
            },
            {
              $project: {
                uniqueTraderCount: { $size: '$uniqueTraders' }
              }
            }
          ]
        const result = await view.aggregate(traderPipeline).toArray();
        console.log('View created successfully');
        return result.uniqueTraderCount;
      } catch (err) {
        console.error('Error creating the view:', err);
      } 
  }
  

// Call the function to create the view
// createTradeView();
