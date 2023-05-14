var express = require('express');
const app = express();
app.use(express.json());
var user = require('./routes/users');
var broker = require('./message/broker');
const session = require('express-session')

// セッションの生存時間（分で指定）
const maxage = 10;
//アクセスされる度にセッション時間を延長する
app.use(session({
    secret: 'keyboard cat', cookie: { maxAge: maxage * 60000 }
}));

//認証無しAPI
app.post('/', function (req, res) {
    console.log(req.body)
    return res.json({ status: "OK" });
})

//userに来たものは、すべてroutesのusersへ。。。
app.use("/user", user)

const server = app.listen(3000, () =>
    console.log(`🚀 Server ready at: http://localhost:3000\n⭐️ UMAXIAOTIAN`),
)