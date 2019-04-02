var createError = require('http-errors');   // 插件  http 错误提示  
var express = require('express');
var path = require('path');   // node path模块 处理 路径
var cookieParser = require('cookie-parser');   // 处理 cookies 
var logger = require('morgan');    // 日志 log 

// 路由模块 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var commentRouter = require("./routes/comment");

var app = express();

var session = require("express-session");

// view engine setup  __dirname 根目录  join拼接 
app.set('views', path.join(__dirname, 'views'));   // views 文件拼接到根目录  方便读取  
app.set('view engine', 'ejs');   // 声明模板引擎 

app.use(logger('dev'));    // 日子打印  dev 开发环境 
app.use(express.json());    // 接收 POST 参数  req.body  req.query  $.post 
app.use(express.urlencoded({ extended: false })); // 表单提交method="POST"
app.use(cookieParser());  // 设置 cookies
app.use(express.static(path.join(__dirname, 'public')));  // static 静态文件  去掉 public 文件目录 

app.use(session({
  secret:"test",
  name:"appTest",
  cookie:{maxAge:20*60*1000},
  resave:false,
  saveUninitialized:true
}));


app.use('/', indexRouter);  // 设置 路由别名 为了防止 路由重名 
app.use('/users', usersRouter);
// app.use("/comment",commentRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler   404 500 300 http error 
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
