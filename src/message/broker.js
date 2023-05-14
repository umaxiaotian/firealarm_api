// モジュールの定義
const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const db = require('../../models/index');
var crypto = require("crypto");
//MQTTブローカーのポート
const port = 1883

// sha-512で暗号化
const hashed = password => {
    let hash = crypto.createHmac('sha512', password)
    hash.update(password)
    const value = hash.digest('hex')
    return value;
}

aedes.authenticate = async function (client, username, password, callback) {

    try {
            const reqUserName = username
            if(password){
                const reqPass = password.toString()
            }else{
                var error = new Error('Auth error')
                error.returnCode = 4
                callback(error, null)
            }
        //DBからユーザーを取得する
        const user = await db.User.findOne({ where: { username: reqUserName } });
        if (user.username === reqUserName && user.password === hashed(reqPass)) {
            callback(null, username === reqUserName)
        }
        else {
            var error = new Error('Auth error')
            error.returnCode = 4
            callback(error, null)
        }
    } catch (error) {
        console.log("ERROR")
    }
}


// if(username === "admin" & password.toString() ===  "pass" ){
//      callback(null,username==="admin")
// }else{
//     var error = new Error('Auth error')
//     error.returnCode = 4
//     callback(error, null)
// }
//   }


// クライアントエラーの場合
aedes.on('clientError', function (client, err) {
    console.log('client error', client.id, err.message, err.stack)
})

// 接続エラーの場合
aedes.on('connectionError', function (client, err) {
    console.log('client error', client, err.message, err.stack)
})

// publishされた場合
aedes.on('publish', function (packet, client) {
    if (client) {
        console.log('message from client', client.id)
    }
})

// 新しいsubscriberが接続した場合
aedes.on('subscribe', function (subscriptions, client) {
    if (client) {
        console.log('subscribe from client', subscriptions, client.id)
    }
})

// 新しいクライアントが接続した場合
aedes.on('client', function (client) {
    console.log('new client', client.id)
})

// MQTTブローカー起動
server.listen(port, function () {
    console.log('server listening on port', port)
})