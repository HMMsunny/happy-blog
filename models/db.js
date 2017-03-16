/**
 * Created by ������ on 2017/3/13.
 */
"use strict";

const mysql = require('mysql');

// ����һ�����ݿ����ӳ�
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

    //����û���������������������SQL �� callback
    if(arguments.length==2&&typeof arguments[1]=='function'){
        callback=P;
    }else if(arguments.length==3&&Array.isArray(arguments[1])&&typeof arguments[2]=='function'){
        params=P;
        callback=C;
    }else{
        throw new Error('�Բ��𣬲���������ƥ����߲������ʹ���');
    }

    //�ӳ���������һ������ʹ�õ�����

    pool.getConnection(function(err,connection){
        connection.query(sql,params,function(){
            //ʹ����Ϻ󣬽��������ͷŻ����ӳ�
            connection.release();
            callback.apply(null,arguments);
        });
    });







};


































