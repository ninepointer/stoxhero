const {tenx, paperTrade, infinityTrade, internship} = require("./controllers/AutoTradeCut/autoTradeCut");
const { Kafka } = require('kafkajs')
const {takeAutoTenxTrade, takeAutoPaperTrade, takeAutoInfinityTrade, takeAutoInternshipTrade} = require("./controllers/AutoTradeCut/autoTrade");
let kafka;
if(process.env.PROD){
  kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['b-1.democluster1.bagf1q.c3.kafka.ap-south-1.amazonaws.com:9092', 
              'b-2.democluster1.bagf1q.c3.kafka.ap-south-1.amazonaws.com:9092', 
              'b-3.democluster1.bagf1q.c3.kafka.ap-south-1.amazonaws.com:9092'],  // replace with your brokers
  })
} else{
  kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['b-1.kafkastaging.v0i16x.c3.kafka.ap-south-1.amazonaws.com:9092', 
              'b-2.kafkastaging.v0i16x.c3.kafka.ap-south-1.amazonaws.com:9092', 
              'b-3.kafkastaging.v0i16x.c3.kafka.ap-south-1.amazonaws.com:9092'],  // replace with your brokers
  })
}


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

  console.log("tenx", tenXArr);
  console.log("paperArr", paperArr);
  console.log("infinityArr", infinityArr);
  console.log("interArr", interArr);

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

















[
  // {
  //   "symbol": "NIFTY2360118700PE",
  //   "type": "Buy",
  //   "amount": 1756847,
  //   "lot": 10300
  // },

  
  // {
  //   "symbol": "NIFTY2360118600PE",
  //   "type": "Buy",
  //   "amount": 29404.000000000004,
  //   "lot": 400
  // },

  
  // {
  //   "symbol": "NIFTY2360118650CE",
  //   "type": "Buy",
  //   "amount": 21391,
  //   "lot": 1000
  // },

  
  // {
  //   "symbol": "NIFTY2360118650CE",
  //   "type": "Sell",
  //   "amount": 21875,
  //   "lot": 1500
  // },

  
  // {
  //   "symbol": "NIFTY2360118600PE",
  //   "type": "Sell",
  //   "amount": 110105,
  //   "lot": 2000
  // },

  
  {
    "symbol": "BANKNIFTY2360144300PE",
    "type": "Sell",
    "amount": 1110762,
    "lot": 2700
  },

  
  // {
  //   "symbol": "NIFTY2360118400CE",
  //   "type": "Sell",
  //   "amount": 6950,
  //   "lot": 50
  // },

  
  // {
  //   "symbol": "NIFTY2360118400CE",
  //   "type": "Buy",
  //   "amount": 7600,
  //   "lot": 50
  // },
  // {
  //   "symbol": "NIFTY2360118700PE",
  //   "type": "Sell",
  //   "amount": 1730051,
  //   "lot": 10300
  // }
]