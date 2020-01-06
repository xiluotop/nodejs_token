# NodeJs 的 token 验证

## 开发日志

2020.1.6

> 完成服务端的 token 基本创建和验签

## 目录说明

* public 静态资源文件
* src 资源文件
* app.js 入口文件
* key 存放加密秘钥
* routes 路由文件
* tools 工具类

## 测试步骤

### 使用 node + jwt(jwt-simple) 搭建 token 身份验证

`npm i jwt-simple// 安装 jsonwebtoken 模块`

## 封装验证类

```JavaScript
// 创建 token 类
class Jwt {
  constructor(data) {
    this.data = data;
  }
  // 生成 token
  generateToken() {
    let data = this.data;
    let created = Math.floor(Date.now() / 1000);
    // 读取私钥
    let cert = fs.readFileSync(path.join(__dirname, '../key/pravite_key.txt'));
    let token = jwt.encode({
      data,
      // 过期时间
      exp: created + 60 * 2
    }, cert);
    return token;
  }
  // 验证 token
  verifyToken(token) {
    let cert = fs.readFileSync(path.join(__dirname, '../key/pravite_key.txt'));
    let res;
    try {
      let result = jwt.decode(token, cert) || {};
      let {
        exp = 0
      } = result, current = Math.floor(Date.now() / 1000);
      if(current<=exp){
        res = result.data || {}
      }
    } catch (error) {
      res = 'err'
    }
    return res;
  }
}
```

### 请求验证

```javascript
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
```

