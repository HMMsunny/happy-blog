/**
 * Created by 黄蒙蒙 on 2017/3/13.
 */
'use strict'

const User=require('../models/user');
const utility=require('utility');
const formidable=require('formidable');
const path=require('path');
const fs=require('fs');
const gm=require('gm');

exports.showRegister=function(req,res,next){


    res.render('register');
}


//注册功能
exports.doRegister=function(req,res,next){
    //后台接受前台发送过来的数据
    //第一步：接收用户通过表单输入的数据
   // console.log('1');
    let username=req.body.username;
    let password=req.body.password;
    let email=req.body.email;
    let vcode = req.body.vcode;
    let avatar='avatar.png';

    //对用户提交的数据进行普通校验
    //用户名校验  后期完善
    if(username==''){
        return res.json({
            code:'0',
            msg:'用户名不能为空'
        });
    }
//第三部 执行具体的业务逻辑校验，如果用户已存在，则响应给客户端，用户已存在 如果不存在，可以注册
    //校验用户是否存在
    User.getByUsername(username,function(err,result){
    if(err){
        return next(err);
    }
    if(result){
        return res.json({
            code:'0',
            msg:'用户名已存在'
        });
    }

    //如果用户不存在  将该用户保存至数据库
    //加密
    password=`${utility.md5(utility.md5(password+req.app.locals.config.secret))}`;

    let user=new User({
        username,
        password,
        email,
        avatar
    });

    user.save(function(err,result){
        if(err){
            return next(err);
        }
       // console.log(result.insertId);
        let uid=result.insertId;

        if(uid==0){
            return res.json({
                code:'0',
                msg:'failed'
            });
        }
        user.id=uid;

        //代码执行到这里，代表用户注册成功，所以要记录用户登录成功的状态
      req.session.user = user;
        //console.log(req.session.user);

        res.json({
            code:'1',
            msg:'success'
        });
    });
 });
};

//展示登陆页面
exports.showLogin=function(req,res,next){
    res.render('login');
}

//登陆功能
exports.doLogin=function(req,res,next){
    //接受用户数据
    let username=req.body.username.trim();
    let password=req.body.password.trim();

    //基本的数据校验
    if(username=='') {
        return res.json({
            code: '0',
            msg: '用户名不能为空'
        });
    }
    //具体的业务逻辑校验
    //该用户是否存在
    //先根据用户名把用户记录查询出来，如果没有，表示该用户不存在，结束相应
    //如果存在，校验密码是否正确，如果正确，写入session，跳转到首页
    User.getByUsername(username,function(err,result){
        //console.log(result);
        if(!result){
            return res.json({
                code:'0',
                msg:'用户不存在'
            });
        }

        password=`${utility.md5(utility.md5(password+req.app.locals.config.secret))}`;

        if(password!==result.password){
            return res.json({
                code:'0',
                msg:'密码错误'
            });
        }
        //写入session
        req.session.user=result;

        //跳转到首页
        res.json({
            code:'1',
            msg:'success'
        });
    });

};

//用户退出
exports.doLogout=function(req,res,next){
    req.session.user=null;
    res.redirect('/');
}

//用户设置

exports.showSeting=function(req,res,next) {
    let uid = req.session.user.id;

    User.getById(uid, function (err, result) {
        if (err) {
            return next(err);
        }
        res.render('setting', {
            user: result,
            avatar: result.avatar
        });

    });
}

//上传头像
exports.uploadAvatar=function(req,res,next){
    //console.log('1');
    var form =new formidable.IncomingForm();

    //上传到指定目录
    form.uploadDir=req.app.locals.config.avatarDir;

    form.parse(req,function(err,fields,files){
        if(err){
            return res.json({
                code:'0',
                msg:'failed'
            });
        }
        //console.log(files);
        let avatar=files.avatar;
        let tmpPath=avatar.path;
        let size=avatar.size;
        let name=avatar.name;

        let newPath=tmpPath+path.extname(name);

        fs.rename(tmpPath,newPath,function(){
          let uid=req.session.user.id;
            User.updateAvatarById(path.basename(newPath),uid,function(err,result){

                    if(err){
                        return next(err);
                    }
                    if(result.affectedRows>0){
                        res.json({
                            code: '1',
                            msg: `/uploads/avatar/${path.basename(newPath)}`
                        });
                    }
                });

        });

    });
}













