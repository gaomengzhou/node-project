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
    title: 'Express',
    admin: req.session.admin
  });
});

router.get("/login", (req, res) => {
  var admin = req.query.admin || "";



  res.render("login")
})




















module.exports = router;