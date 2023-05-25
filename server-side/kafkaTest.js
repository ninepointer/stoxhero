const {tenx, paperTrade, infinityTrade, internship} = require("./controllers/AutoTradeCut/autoTradeCut");
const { Kafka } = require('kafkajs')
const {takeAutoTenxTrade, takeAutoPaperTrade, takeAutoInfinityTrade, takeAutoInternshipTrade} = require("./controllers/AutoTradeCut/autoTrade");


const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['b-1.democluster1.bagf1q.c3.kafka.ap-south-1.amazonaws.com:9092', 
            'b-2.democluster1.bagf1q.c3.kafka.ap-south-1.amazonaws.com:9092', 
            'b-3.democluster1.bagf1q.c3.kafka.ap-south-1.amazonaws.com:9092'],  // replace with your brokers
})

const createTopic = async (topicName) => {
    const admin = kafka.admin()
    await admin.connect()
  
    await admin.createTopics({
      topics: [{
        topic: topicName,
        numPartitions: 10,
        replicationFactor: 3
      }],
    })
  
    await admin.disconnect()
}
  

async function test(){
  createTopic('tenx');
  createTopic('paper');
  createTopic('infinity');
  createTopic('internship');

  let tenXArr = await tenx();
  let paperArr = await paperTrade();
  let infinityArr = await infinityTrade();
  let interArr = await internship();

  const producer = kafka.producer()
  
  await producer.connect()
  await Promise.all([
    producer.send({ topic: 'tenx', messages: tenXArr }),
    producer.send({ topic: 'paper', messages: paperArr }),
    producer.send({ topic: 'infinity', messages: infinityArr }),
    producer.send({ topic: 'internship', messages: interArr })
  ]);

  await producer.disconnect()

  const consumer = kafka.consumer({ groupId: 'my-group' })

  await consumer.connect()
  await consumer.subscribe({ topics: ['tenx', 'paper', 'infinity', 'internship'], fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      if(topic == 'tenx'){
        console.log("tenx", value)
        // await takeAutoTenxTrade(value)
      }
      if(topic == 'paper'){
        console.log("paper", value)
        // await takeAutoPaperTrade(value)
      }
      if(topic == 'infinity'){
        console.log("infinity", value)
        // await takeAutoInfinityTrade(value)
      }
      if(topic == 'internship'){
        console.log("internship", value)
        // await takeAutoInternshipTrade(value)
      }
    },
  })
}

module.exports = test;





// const {tenx, paperTrade, infinityTrade, internship} = require("./controllers/AutoTradeCut/autoTradeCut");
// const { Kafka } = require('kafkajs')
// const {takeAutoTenxTrade, takeAutoPaperTrade, takeAutoInfinityTrade, takeAutoInternshipTrade} = require("./controllers/AutoTradeCut/autoTrade");


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
// }
  

// async function test(){
//   createTopic('tenx');
//   createTopic('paper');
//   createTopic('infinity');
//   createTopic('internship');

//   let tenXArr = await tenx();
//   let paperArr = await paperTrade();
//   let infinityArr = await infinityTrade();
//   let interArr = await internship();

//   const producer = kafka.producer()
  
//   await producer.connect()
//   await Promise.all([
//     producer.send({ topic: 'tenx', messages: tenXArr }),
//     producer.send({ topic: 'paper', messages: paperArr }),
//     producer.send({ topic: 'infinity', messages: infinityArr }),
//     producer.send({ topic: 'internship', messages: interArr })
//     // producer.send({ topic: 'tenx', messages: [{value: "1st"}]}),
//     // producer.send({ topic: 'paper', messages: [{value: "2st"}]}),
//     // producer.send({ topic: 'infinity', messages: [{value: "3st"}]}),
//     // producer.send({ topic: 'internship', messages: [{value: "4st"}]})
//   ]);

//   await producer.disconnect()

//   const consumer = kafka.consumer({ groupId: 'my-group' })

//   await consumer.connect()
//   await consumer.subscribe({ topics: ['tenx', 'paper', 'infinity', 'internship'], fromBeginning: true })

//   // await consumer.subscribe({ topic: 'my-topic', fromBeginning: true })

//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       // await Promise.all([
//       if(topic == 'tenx'){
//         takeAutoTenxTrade(value)
//         // const value = message.value.toString();
//         // console.log("tenx", value)
//       }
//       if(topic == 'paper'){
//         takeAutoPaperTrade(value)
//         // const value = message.value.toString();
//         // console.log("paper", value)
//       }
//       if(topic == 'infinity'){
//         takeAutoInfinityTrade(value)
//         // const value = message.value.toString();
//         // console.log("infinity", value)
//       }
//       if(topic == 'internship'){
//         takeAutoInternshipTrade(value)
//         // const value = message.value.toString();
//         // console.log("internship", value)
//       }
      
//       // console.log("partition", partition)
      
//       // await Promise.all([
//       //   takeAutoTenxTrade(value),
//       //   takeAutoPaperTrade(value),
//       //   takeAutoInfinityTrade(value)
//       // ]);
//     },
//   })
// }

// module.exports = test;
