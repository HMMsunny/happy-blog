/**
 * Created by 黄蒙蒙 on 2017/3/13.
 */
"use strict";

const mysql = require('mysql');

// 创建一个数据库连接池
var pool =mysql.createPool({
    connectionLimit:50,
    host:'localhost',
    user:'root',
    password:'root',
    database:'blog'

});


exports.query=function(sql,P,C) {
    let params=[];
    let callback;

    //如果用户传入了两个参数，就是SQL 和 callback
    if(arguments.length==2&&typeof arguments[1]=='function'){
        callback=P;
    }else if(arguments.length==3&&Array.isArray(arguments[1])&&typeof arguments[2]=='function'){
        params=P;
        callback=C;
    }else{
        throw new Error('对不起，参数个数不匹配或者参数类型错误');
    }

    //从池子里面拿一个可以使用的连接

    pool.getConnection(function(err,connection){
        connection.query(sql,params,function(){
            //使用完毕后，将该连接释放回连接池
            connection.release();
            callback.apply(null,arguments);
        });
    });







};


































