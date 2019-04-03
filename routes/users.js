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

//注册
router.post("/register", (req, res) => {
  var body = req.body;
  conn((err, db) => {
    if (err) {
      res.json({
        errMsg: "数据库错误",
        code: 500
      })
      db.close();
      throw err;
    } else {
      var users = db.collection("users");
      waterfall([
        (callback) => {
          users.findOne({
            username: body.username
          }, {}, (err, result) => {
            if (err) {
              callback(err, null);
            } else {
              callback(null, result);
            }
          });
        },
        (arg, callback) => {
          if (arg) {
            callback(null, {
              msg: "用户名已存在",
              code: 200,
              type: "1"
            })
          } else {
            body.enterTime = new Date();
            users.insert(body, (err, result) => {
              if (err) {
                callback(err, null);
              } else {
                callback(null, {
                  msg: "注册成功",
                  code: 200,
                  type: "0"
                })
              }
            })
          }
        }
      ], function (err, result) {
        if (err) {
          res.json({
            errMsg: "数据错误",
            code: 500
          })
          db.close();
          throw err;
        } else {
          if (result.type == "1") {
            res.send(`<script>alert('${result.msg}');location.href='/zhuce'</script>`);
          } else {
            res.send(`<script>alert('${result.msg}');location.href='/login?username=${aesEncrypt(body.username,keys)}'</script>`);
          }
          db.close();
        }
      })
    }
  })
})



//登入

router.post("/login", (req, res) => {
  var body = req.body;
  
  console.log(body);
  body.password = body.password * 1;
  conn((err, db) => {
    setError(err, res, db);
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