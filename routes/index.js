var express = require('express');
var router = express.Router();
var {
  aesDecrypt,
  keys,
  conn,
  setError
} = require("../utils");
var session = require('express-session');
var {
  waterfall
} = require("async");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
  console.log(req.session)
});

router.get("/login", (req, res) => {
  var username = req.query.username || "";
  console.log(username);
  username = username ? aesDecrypt(username, keys) : username;
  // 解密  
  res.render("login.ejs", {
    msg: "接收数据  从 数据库 查询处理的结果 ",
    username
  });
})



















module.exports = router;