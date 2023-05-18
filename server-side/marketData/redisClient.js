// if(process.env.PROD){

    // const redis = require('redis');
    // let isRedisConnected;
    // client = redis.createClient(
    //     {
    //         url:  `redis://stoxhero-redis.zvfkqy.ng.0001.aps1.cache.amazonaws.com`,
    //         // url: `redis://stoxhero-staging-redis-001.zvfkqy.0001.aps1.cache.amazonaws.com`
    //     }
    // )
    // module.exports = {client, isRedisConnected};

// }
// else if(process.env.STAGE){
    
    // const redis = require('redis');
    // let isRedisConnected = true;
    // client = redis.createClient(
    //     {
    //         // url:  `redis://stoxhero-redis.zvfkqy.ng.0001.aps1.cache.amazonaws.com`,
    //         url: `redis://stoxhero-staging-redis-001.zvfkqy.0001.aps1.cache.amazonaws.com`
    //     }
    // )
    // module.exports = {client, isRedisConnected};

// }
// else{

    
    const redis = require('redis');
    let isRedisConnected = true;
    // function setValue(value){
    //     isRedisConnected = value;
    // }
    const client = redis.createClient(6379, 'http://127.0.0.1:8081/');

    module.exports = {client, isRedisConnected}


    // module.exports = client;

// }