/**
 * Created by 黄蒙蒙 on 2017/3/13.
 */
'use strict'

const moment=require('moment');
const Article=require('../models/article');
const md =require('markdown-it')();
const formidable=require('formidable');
const fs=require('fs');
const path=require('path');


//展示发表文章页面
exports.showPublish=function(req,res,next){
    // 如果用户没有登录，直接跳转到首页
    if (!req.session.user) {
        return res.redirect('/');
    }

    res.render('publish', {
        user: req.session.user
    });
};
//发表文章功能
exports.doPublish=function(req,res,next){
    //接受表单的数据
    let title=req.body.title;
    let content=req.body.content;
    let time=moment().format('YYYY-MM-DD HH:mm:ss');
    let uid=req.session.user.id;

    console.log(content);

    //基本数据校验

    //业务逻辑处理
    let article=new Article({
        title,
        content,
        time,
        uid
    });

    article.save(function(err,result){
        if(err){
            return next(err);
        }
        let insertId=result.insertId;
        if(insertId<=0){
            return res.json({
                code:'0',
                msg:'failed'
            });
        }

        res.json({
            code:'1',
            msg:insertId
        });
    });
};
//展示文章
exports.showArticle=function(req,res,next){
    //接受用户提交的数据
    let articleId=req.params.articleId;

    //拿着文章的ID去数据库中查询
    Article.getById(articleId,function(err,article){
    if(err){
        return next(err);
    }

       // console.log(article);
    article.content=md.render(article.content);
        res.render('article',{
            article:article,
            user:req.session.user
        });

    } );
















};
//上传文件
exports.uploadImage=function(req,res,next){
    var form =new formidable.IncomingForm();
    //设置上传路径
    form.uploadDir=req.app.locals.config.uploadDir;
    form.parse(req,function(err,fields,files){
        if(err){
            return res.json({
                code:'0',
                msg:'failed'
            });
        }
        //console.log(files);
        let pic=files.pic;
        let tmpPath=pic.path;
        // path: 'c:\\Users\\黄蒙蒙\\Desktop\\test\\happy-blog\\uploads\\upload_fcd4cb7cb4bba21aadcdcc8420533c68'
        let size=pic.size;
        // size: 69990
        let name=pic.name;
        //name: '1.jpg'
        let newPath=tmpPath+path.extname(name);
       // console.log(path.basename(newPath));
        //upload_cbed602c48ab394d1045abd4a4ca1e89.jpg
        fs.rename(tmpPath,newPath,function(){
            //将该图片的请求响应给客户端就行了
            res.json({
                code:'1',
                msg:`/uploads/${path.basename(newPath)}`
            });
        });
    });
};

//获取页数
exports.getByPageNumber=function(req,res,next){
    let pageNumber=req.params.pageNumber;//获取用户查看的页码
    //获取配置文件中每页要显示的记录数，也就是告诉数据库要取出多少条记录
    let pageSize=req.app.locals.config.pageSize;
    //告诉数据路查询时要跳过多少记录
    let skipNumber=(pageNumber-1)*pageSize;
    Article.getByPage(skipNumber,pageSize,function(err,result){
        if(err){
            return next(err);
        }
        //对esult中的每一项的时间time，修改为相对时间
        result.map(a=>a.time=moment(a.time).startOf('second').fromNow());
        res.json({
            result
        });
    });





};




















