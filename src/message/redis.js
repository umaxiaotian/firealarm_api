var redis = require('redis');
const client = redis.createClient({ url: 'redis://redis:6379' })

client.on('connect', function () {
    console.log('Redisに接続しました');
});

client.on('error', function (err) {
    console.log('次のエラーが発生しました：' + err);
});

client.user_insert =async  function(username, value) { 

    
     const key_list = await client.keys(username+'@*')
    var key_num_array = []
     key_list.forEach(element => {
        key_num_array.push(Number(element.replace(username+'@', "")));
     });
     var max = Math.max.apply(null, key_num_array);

    console.log(max)

    max++;

   await  client.set(username+'@'+max,value)
//    client.quit()

}


async function dbconnection() {
    await client.connect();
}

dbconnection();

module.exports = client;