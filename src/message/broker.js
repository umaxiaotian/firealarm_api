// モジュールの定義
const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)

//MQTTブローカーのポート
const port = 1883

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