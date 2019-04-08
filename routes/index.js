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

  if (req.session.username) {
    conn((err, db) => {
      setError(err, res, db);
      db.collection("users").find({}, {}).sort({
        _id: -1
      }).toArray((err, result) => {
        setError(err, res, db);
        res.render('index', {
          result,
          title: 'Express',
          username: req.session.username
        });
        db.close;
      })
    })
  } else {
    res.send("<script>alert('session过期-请先登入');location.href='/login'</script>")
  }



  console.log(req.session)
});

//注册
router.get("/zhuce", (req, res) => {
  res.render("zhuce")
})


//登入
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


//退出
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  })

})

//获取用户列表

router.get("/userlist", (req, res) => {
  var query = req.query;
  for (var i in query) {
    query[i] = query[i] * 1;
  }
  if (req.session.username) {
    conn((err, db) => {
      {
        setError(err, res, db);
        db.collection("users").find({}, {}).sort(query).toArray((err, result) => {
          setError(err, res, db);
          res.render("userlist", {
            result
          });
          db.close();
        })
      }
    })
  } else {
    res.send("<script>alert('session已经过期,请重新登录...');location.href='/login' </script>")
  }
})

router.get("/searchList", (req, res) => {
  var query = req.query;
  var keyword = query.keyword;
  if (req.session.username) {
    conn((err, db) => {
      setError(err, res, db);
      db.collection("users").find({
        $or: [{
            username: new RegExp(keyword)
          },
          {
            userId: new RegExp(keyword)
          }
        ]
      }, {}).toArray((err, result) => {
        setError(err, res, db);
        res.render("index", {
          result
        });
        db.close();
      })
    })
  } else {
    res.send("<script>alert('session已经过期,请重新登录...');location.href='/login' </script>")
  }
})

router.get("/DepartmentManagement", (req, res) => {
  res.render("DepartmentManagement");
})







module.exports = router;