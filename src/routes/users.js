
var express = require('express');
var router = express.Router();
router.use(express.json());
var jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const session = require('express-session')
var crypto = require("crypto");
const db = require('../../models/index');

// Cross Originを有効化
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  next();
});

// Optionsも
router.options('*', (req, res) => {
  res.sendStatus(200);
});

// セッションの生存時間（分で指定）
const maxage = 1;

// セッション管理設定
router.use(session({ secret: 'keyboard cat', cookie: { maxAge: maxage * 60000 } }))

// セッション管理関数
const sessionCheck = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.status(440).json({ message: 'セッション切れです' })
  }
}

// sha-512で暗号化
const hashed = password => {
  let hash = crypto.createHmac('sha512', password)
  hash.update(password)
  const value = hash.digest('hex')
  return value;
}

// ログイン処理
router.post('/login', async (req, res, next) => {
  const reqUserName = req.body.username
  const reqPass = req.body.password

  try {
    //DBからユーザーを取得する
    const user = await db.User.findOne({ where: { username: reqUserName } });
    if (user.username === reqUserName && user.password === hashed(reqPass)) {
      req.session.username = { name: req.body.username };
      res.send(200)
    }
    else {
      res.status(401).json({ message: 'ユーザー名/パスワードが一致しません' })
    }
  }
  catch (error) {
    res.status(500).json({ message: 'error' })
  }
});

// ユーザー登録処理
router.post('/register', async (req, res, next) => {
  const reqUserName = req.body.username
  const reqPass = req.body.password
  const reqFirstName = req.body.firstName
  const reqLastName = req.body.lastName
  const reqEmail = req.body.email
  try {
    //DBからユーザーを取得する
    const addData = await db.User.create({
      username: reqUserName,
      password: hashed(reqPass),
      firstName: reqFirstName,
      lastName: reqLastName,
      email: reqEmail
    })
    res.send(200)
  } catch (error) {
    res.status(500).json({ message: 'error' })
  }
})

router.delete('/logout', (req, res) => {
  // セッションを破棄
  req.session.destroy((err) => {
      res.status(401).send('logout');
  });
});



router.get('/', (req, res, next) => {
  sessionCheck(req, res, next)
  res.sendStatus(200)
})


module.exports = router;