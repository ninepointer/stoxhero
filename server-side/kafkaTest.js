const tenx = require("./controllers/AutoTradeCut/autoTradeCut");



// const { Kafka } = require('kafkajs')

// const kafka = new Kafka({
//   clientId: 'my-app',
//   brokers: ['b-1.democluster1.bagf1q.c3.kafka.ap-south-1.amazonaws.com:9092', 
//             'b-2.democluster1.bagf1q.c3.kafka.ap-south-1.amazonaws.com:9092', 
//             'b-3.democluster1.bagf1q.c3.kafka.ap-south-1.amazonaws.com:9092'],  // replace with your brokers
// })

// const createTopic = async (topicName) => {
//     const admin = kafka.admin()
//     await admin.connect()
  
//     await admin.createTopics({
//       topics: [{
//         topic: topicName,
//         numPartitions: 10,
//         replicationFactor: 3
//       }],
//     })
  
//     await admin.disconnect()
//   }
  
//   createTopic('my-topic');
(async () => {
    try {
      console.log("hii");
    //   console.log(await tenx());
      let arr = await tenx();
      console.log(arr);
    } catch (error) {
      console.error(error);
    }
  })();
// (async () => {
//   const producer = kafka.producer()
  
//   await producer.connect()
//   await producer.send({
//     topic: 'my-topic',
//     messages: arr,
//   })

//   await producer.disconnect()

//   const consumer = kafka.consumer({ groupId: 'my-group' })

//   await consumer.connect()
//   await consumer.subscribe({ topic: 'my-topic', fromBeginning: true })

//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       console.log({
//         value: message.value.toString(),
//       })
//     },
//   })
// })().catch(console.error)


// const tenx = require("./controllers/AutoTradeCut/autoTradeCut");
// let arr = await tenx();
// console.log(arr)
// 