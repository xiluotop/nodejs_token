// ---------------token 验证工具文件-------------------
// 引入模块依赖
const fs = require('fs');
const path = require('path')
const jwt = require('jwt-simple')

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

module.exports = Jwt;