// if(process.env.PROD){

    // let isRedisConnected ;
    // function setValue(value){
    //     isRedisConnected = value;
    // }

    // function getValue(){
    //     return isRedisConnected;
    // }
    // const redis = require('redis');
    // client = redis.createClient(
    //     {
    //         url:  `redis://stoxhero-redis.zvfkqy.ng.0001.aps1.cache.amazonaws.com`,
    //     }
    // )

    // client2 = redis.createClient(
    //     {
    //         url:  `redis://stoxhero-redis.zvfkqy.ng.0001.aps1.cache.amazonaws.com`,
    //     }
    // )
    // client3 = redis.createClient(
    //     {
    //         url:  `redis://stoxhero-redis.zvfkqy.ng.0001.aps1.cache.amazonaws.com`,
    //     }
    // )
    // client4 = redis.createClient(
    //     {
    //         url:  `redis://stoxhero-redis.zvfkqy.ng.0001.aps1.cache.amazonaws.com`,
    //     }
    // )

    // const ioredis = require('ioredis');

    // const clientForIORedis = new ioredis("redis://stoxhero-redis.zvfkqy.ng.0001.aps1.cache.amazonaws.com");

    // module.exports = {client, isRedisConnected, setValue, getValue, clientForIORedis}

// }
// else if(process.env.STAGE){
    // let isRedisConnected ;
    // function setValue(value){
    //     isRedisConnected = value;
    // }
    // function getValue(){
    //     return isRedisConnected;
    // }
    // const redis = require('redis');
    // client = redis.createClient(
    //     {
    //         url: `redis://stoxhero-staging-redis-001.zvfkqy.0001.aps1.cache.amazonaws.com`
    //     }
    // )
    // client2 = redis.createClient(
    //     {
    //         url: `redis://stoxhero-staging-redis-001.zvfkqy.0001.aps1.cache.amazonaws.com`
    //     }
    // )
    // client3 = redis.createClient(
    //     {
    //         url: `redis://stoxhero-staging-redis-001.zvfkqy.0001.aps1.cache.amazonaws.com`
    //     }
    // )
    // client4 = redis.createClient(
    //     {
    //         url: `redis://stoxhero-staging-redis-001.zvfkqy.0001.aps1.cache.amazonaws.com`
    //     }
    // )

    // const ioredis = require('ioredis');
    // const clientForIORedis = new ioredis(`redis://stoxhero-staging-redis-001.zvfkqy.0001.aps1.cache.amazonaws.com`);
    // module.exports = {client, isRedisConnected, setValue, getValue, clientForIORedis}

// }
// else{

    let isRedisConnected ;
    function setValue(value){
        isRedisConnected = true;
    }

    function getValue(){
        return isRedisConnected;
    }
    const redis = require('redis');
    client = redis.createClient(6379, 'http://127.0.0.1:8081/');
    client2 = redis.createClient(6379, 'http://127.0.0.1:8081/');
    client3 = redis.createClient(6379, 'http://127.0.0.1:8081/');
    client4 = redis.createClient(6379, 'http://127.0.0.1:8081/');
    const ioredis = require('ioredis');

    const clientForIORedis = new ioredis();

    module.exports = {client4, client3, client2, client, isRedisConnected, setValue, getValue, clientForIORedis}

