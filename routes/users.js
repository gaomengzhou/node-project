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

router.post("/login", (req, res) => {
  var body = req.body;
  console.log(body)

  conn((err, db) => {
    setError(err, res, db);
    var finData = function (db, callback) {
      db.collection("admin").findOne(body, {}, (err, result) => {
        setError(err, res, db);
        callback(result);
      })
    }

    finData(db, (result) => {
      if (result) {
        console.log(req.session);
        req.session.admin = body.admin;
        res.redirect("/");
      } else {
        res.send(`<script>alert("登录失败,请重新登录!");location.href='/login?admin=${body.admin}'</script>`)
      }
    })
  })
})


















module.exports = router;