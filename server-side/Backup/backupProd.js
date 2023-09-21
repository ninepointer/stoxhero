const { MongoClient } = require('mongodb');
const backupDatabase = async(sourceUri, targetUri) => {


    // try {
    //     const sourceClient = await MongoClient.connect(sourceUri, { useUnifiedTopology: true });
    //     const targetClient = await MongoClient.connect(targetUri, { useUnifiedTopology: true });
    
    //     const sourceDb = sourceClient.db();
    //     const targetDb = targetClient.db();
    
    //     // Drop all collections in the target database
    //     const collections = await targetDb.listCollections().toArray();
    //     for (const collection of collections) {
    //       await targetDb.collection(collection.name).drop();
    //     }
    //     console.log('All collections in the target database have been dropped.');
    
    //     const sourceCollections = await sourceDb.listCollections().toArray();
    //     console.log(sourceCollections)
    
    //     for (const sourceCollection of sourceCollections) {
    //       const collectionName = sourceCollection.name;
    //       const isCollectionExistsInTarget = await targetDb.listCollections({ name: collectionName }).hasNext();
          
    //       if (!isCollectionExistsInTarget) {
    //         console.log(`Backing up collection ${collectionName}`);
    //         const documents = await sourceDb.collection(collectionName).find({}).toArray();
    
    //         if (documents.length > 0) {
    //           const bulkOps = documents.map((document) => {
    //             return {
    //               updateOne: {
    //                 filter: { _id: document._id },
    //                 update: { $set: document },
    //                 upsert: true
    //               }
    //             };
    //           });
    
    //           await targetDb.collection(collectionName).bulkWrite(bulkOps);
    //         } else {
    //           console.log(`Collection ${collectionName} is empty, skipping backup`);
    //         }
    //       }
    //     }
    
    //     sourceClient.close();
    //     targetClient.close();
    //   } catch (error) {
    //     console.error(`Error while backing up the database: ${error.message}`);
    //   }

    try {
        const sourceClient = await MongoClient.connect(sourceUri, { useUnifiedTopology: true });
        const targetClient = await MongoClient.connect(targetUri, { useUnifiedTopology: true });
    
        const sourceDb = sourceClient.db();
        const targetDb = targetClient.db();
    
        // Drop all collections in the target database
        const collections = await targetDb.listCollections().toArray();
        for (const collection of collections) {
          await targetDb.collection(collection.name).drop();
        }
        // console.log('All collections in the target database have been dropped.');
    
        const sourceCollections = await sourceDb.listCollections().toArray();
    
        for (const sourceCollection of sourceCollections) {
          const collectionName = sourceCollection.name;
          const isCollectionExistsInTarget = await targetDb.listCollections({ name: collectionName }).hasNext();
          
          if (!isCollectionExistsInTarget) {
            console.log(`Backing up collection ${collectionName}`);
            if(collectionName !== "daily-pnl-datas" && collectionName !== "retreive-trades" && collectionName !== "trader-daily-pnls" && collectionName !== "instrument-ticks-histories" &&
              collectionName != "infinity-live-users" && collectionName != "infinity-trade-companies" && collectionName != "live-trade-companies" && collectionName != "live--trade-users" &&
              collectionName != "all-trade-details"
            ){
              // console.log("in if", collectionName)
              const documents = await sourceDb.collection(collectionName).find({}).toArray();
    
            if (documents.length > 0) {
              const bulkOps = documents.map((document) => {
                return {
                  updateOne: {
                    filter: { _id: document._id },
                    update: { $set: document },
                    upsert: true
                  }
                };
              });
    
              await targetDb.collection(collectionName).bulkWrite(bulkOps);
            }
            } else {
              console.log(`Collection ${collectionName} is empty, skipping backup`);
            }
          }
        }
    
        sourceClient.close();
        targetClient.close();
        console.error(`backup completed`);
        // res.send("ok");
      } catch (error) {
        console.error(`Error while backing up the database: ${error.message}`);
      }
      
}


(async function() {
    await backupDatabase('mongodb+srv://team:N6a6gV6Y6UbQc9BV@stoxhero0.duntdzc.mongodb.net/?retryWrites=true&w=majority', 
    'mongodb+srv://staging-database:kehlVHCGas3KBM75@cluster0.snsb6wx.mongodb.net/?retryWrites=true&w=majority');})();

// const { MongoClient } = require('mongodb');
// exports.backupDatabase = async(sourceUri, targetUri, res) => {


//     try {
//         const sourceClient = await MongoClient.connect(sourceUri, { useUnifiedTopology: true });
//         const targetClient = await MongoClient.connect(targetUri, { useUnifiedTopology: true });
    
//         const sourceDb = sourceClient.db();
//         const targetDb = targetClient.db();
    
//         // Drop all collections in the target database
//         const collections = await targetDb.listCollections().toArray();
//         for (const collection of collections) {
//           await targetDb.collection(collection.name).drop();
//         }
//         console.log('All collections in the target database have been dropped.');
    
//         const sourceCollections = await sourceDb.listCollections().toArray();
    
//         for (const sourceCollection of sourceCollections) {
//           const collectionName = sourceCollection.name;
//           const isCollectionExistsInTarget = await targetDb.listCollections({ name: collectionName }).hasNext();
          
//           if (!isCollectionExistsInTarget) {
//             console.log(`Backing up collection ${collectionName}`);
//             if(collectionName !== "daily-pnl-datas" && collectionName !== "retreive-trades" && collectionName !== "trader-daily-pnls" && collectionName !== "instrument-ticks-histories"){
//               console.log("in if", collectionName)
//               const documents = await sourceDb.collection(collectionName).find({}).toArray();
    
//             if (documents.length > 0) {
//               const bulkOps = documents.map((document) => {
//                 return {
//                   updateOne: {
//                     filter: { _id: document._id },
//                     update: { $set: document },
//                     upsert: true
//                   }
//                 };
//               });
    
//               await targetDb.collection(collectionName).bulkWrite(bulkOps);
//             }
//             } else {
//               console.log(`Collection ${collectionName} is empty, skipping backup`);
//             }
//           }
//         }
    
//         sourceClient.close();
//         targetClient.close();
//         console.error(`backup completed`);
//         // res.send("ok");
//       } catch (error) {
//         console.error(`Error while backing up the database: ${error.message}`);
//       }
      
// }