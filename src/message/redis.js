var redis = require('redis');
const client = redis.createClient({ url: 'redis://redis:6379' })

client.on('connect', function () {
    console.log('Redisに接続しました');
});

client.on('error', function (err) {
    console.log('次のエラーが発生しました：' + err);
});

client.user_insert = async function (username,topic, value) {
    await client.select(3)

    const key_list = await client.keys(username +'?'+topic + '@*')
    var max = 0
    var key_num_array = []
    key_list.forEach(element => {
//   console.log(element)
        key_num_array.push(
            
            Number(element.replace(username +'?'+topic + '@', ''))
            
            );
    });

   

    if(key_num_array[0] === -Infinity || key_num_array[0] === undefined ){
        max = 0;
    }else{
        max = Math.max.apply(null, key_num_array);
        max++;
    }

    // console.log(max)
  

    await client.set(username +'?'+topic + '@' + max, value)
    //    client.quit()

}


module.exports = client;