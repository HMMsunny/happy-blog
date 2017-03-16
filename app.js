/**
 * Created by 黄蒙蒙 on 2017/3/13.
 */
'use strict'

const express = require('express');
const path = require('path');
const bodyParser=require('body-parser');
const config=require('./config');
const router=require('./router');
const cookieParser=require('cookie-parser');
const session=require('express-session');


const app=express();

//配置静态文件服务中间件
app.use('/www',express.static('www'));
app.use('/uploads',express.static('uploads'));

//配置模板引擎，但是这个模板引擎是基于xtempalte，所以要同时装xtemplate和xtpl
app.set('views',path.join(__dirname,'views'));
app.set('view engine','xtpl');

app.locals.config=config;

//配置解析post请求得中间件
app.use(bodyParser.urlencoded({extended:false}));



// 挂载cookie中间件
app.use(cookieParser());

// 挂载Session中间件
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));


//挂载路由中间件
app.use(router);
//配置错误处理中间件
if(config.debug){
    app.use(function(err,req,res,next){
        res.send('糟了，服务器玩儿崩溃了'+err);
    });
}

app.listen(3000,'127.0.0.1',function(){
    console.log('server is running at port 3000');
});




























