const {tenx, paperTrade, infinityTrade} = require("./controllers/AutoTradeCut/autoTradeCut");
const { Kafka } = require('kafkajs')
const {takeAutoTenxTrade, takeAutoPaperTrade, takeAutoInfinityTrade} = require("./controllers/AutoTradeCut/autoTrade");


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
  console.log("is function", typeof(takeAutoTenxTrade))
  createTopic('my-topic');

  let arr = await tenx();
  let arr1 = await paperTrade();
  let arr2 = await infinityTrade();

  const producer = kafka.producer()
  
  await producer.connect()
  await Promise.all([
    producer.send({ topic: 'my-topic', messages: arr }),
    producer.send({ topic: 'my-topic', messages: arr1 }),
    producer.send({ topic: 'my-topic', messages: arr2 })
  ]);

  await producer.disconnect()

  const consumer = kafka.consumer({ groupId: 'my-group' })

  await consumer.connect()
  await consumer.subscribe({ topic: 'my-topic', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      await Promise.all([
        takeAutoTenxTrade(value),
        takeAutoPaperTrade(value),
        takeAutoInfinityTrade(value)
      ]);
    },
  })
}

module.exports = test;
