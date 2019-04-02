


// 封装 链接数据库的 函数 

exports.conn = function(callback){
    var {MongoClient} = require("mongodb");
    var DB_NAME = "project1";
    var CONN_DB_STR = "mongodb://localhost:27017/"+DB_NAME;

    MongoClient.connect(CONN_DB_STR,(err,db)=>{
        if(err){
            callback(err,null);
        }else{
            callback(null,db);
        }
    })

}   


// dateFormat 日期格式化 
exports.dateFormat = function(date){
    var time = new Date(date);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var day = time.getDate();
    var hour = time.getHours();
    var min = time.getMinutes();
    var sec = time.getSeconds();
    return  `${year}-${month}-${day} ${hour}:${min}:${sec}`
}


exports.setError = function(err,res,db){
    if(err){
        res.json({errMsg:"数据库错误",code:500})
        db.close();
        throw err;
    }
}

var crypto = require("crypto"); // node 模块 

// 加密函数
function aesEncrypt(data, key) {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

// 解密 
function aesDecrypt(encrypted, key) {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// daydayup   daydayup+wuhan1807
exports.aesEncrypt = aesEncrypt;   // 加密
exports.aesDecrypt = aesDecrypt;   // 解密
exports.keys = "wh1811";        // 密钥 

// wh1811dayDayup

// daydayup   明文   ===>    daydayup

// ww    wh1811ww 


exports.checkLogin = function(req,res,callback){
    if(req.session.username){
        callback()
    }else{
        res.send("<script>alert('session已经过期,请重新登录...');location.href='/login' </script>")
    }
}


