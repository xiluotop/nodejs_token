// --------------登录模块，登录成功后返回一串 token 数据
const express = require('express')
// 引入 自己的 token js
const JwtUtil = require('../tools/jwt')

let router = express.Router();

// 登录
router.post('/login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  new Promise((resolve, reject) => {
    if (username === 'admin' && password === 'admin') {
      resolve(true)
    } else {
      reject(false)
    }
  }).then(result => {
    if (result) {
      // 登录成功，添加 token 验证
      let jwt = new JwtUtil(username);
      let token = jwt.generateToken();
      res.send({
        state: 200,
        msg: '登录成功',
        token: token
      })
    }
  }).catch(err => {
    console.log(err)
    res.send({
      state: 400,
      msg: '登录失败 ！',
    })
  })
})

module.exports = router;