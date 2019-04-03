var express = require('express');
var router = express.Router();
var session = require('express-session');

var {
  conn,
  aesEncrypt,
  keys,
  setError
} = require("../utils");
var {
  waterfall
} = require("async");



/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});



//登入

router.post("/login", (req, res) => {
  var body = req.body;
  console.log(body);
  body.password = body.password*1;
  conn((err, db) => {
    setError(err, res, db); // 封装 错误 回调函数 
    var findData = function (db, callback) {
      db.collection("users").findOne(body, {}, (err, result) => {
        setError(err, res, db);
        callback(result);
      });
    }

    findData(db, (result) => {
      console.log(result);
      if (result) {
        console.log(req.session);
        req.session.username = body.username;
        req.session.date = new Date();
        res.redirect("/");
      } else {
        res.send(`<script>alert("登录失败,请重新登录!");location.href='/login?username=${aesEncrypt(body.username,keys)}'</script>`)
      }
      db.close();
    })


  })
  // 查询 
})





















module.exports = router;