// 引入框架
const express = require('express')
// 引入所需模块
let JwtUtil = require('./tools/jwt')
let login = require('./routes/login')
let bp = require('body-parser')

// 创建实例化对象
let app = new express();

app.use(bp.urlencoded({
  extended: false
}));

app.use(login)

// 对所有请求进行 token 验证
app.use(function (req, res, next) {
  // 我这里知识把登陆和注册请求去掉了，其他的多有请求都需要进行token校验 
  if (req.url != '/login' && req.url != '/register') {
    let token = req.headers.token;
    let jwt = new JwtUtil(token);
    let result = jwt.verifyToken(token);
    // 如果考验通过就next，否则就返回登陆信息不正确
    if (result == 'err') {
      console.log(result);
      res.send({
        status: 403,
        msg: '登录已过期,请重新登录'
      });
      // res.render('login.html');
    } else {
      res.send({
        res:result,
        status: 200,
        msg: '验证成功!'
      });
      next();
    }
  } else {
    next();
  }
});

//开启服务
app.listen(10086, () => {
  console.log('server start...')
})