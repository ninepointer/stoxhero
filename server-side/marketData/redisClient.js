// if(process.env.PROD){

    // const redis = require('redis');
    // client = redis.createClient(
    //     {
    //         url:  `redis://stoxhero-redis.zvfkqy.ng.0001.aps1.cache.amazonaws.com`,
    //     }
    // )
    // module.exports = client;

// } else{

    const redis = require('redis');
    const client = redis.createClient(6379, 'http://127.0.0.1:8081/');

    module.exports = client;

// }