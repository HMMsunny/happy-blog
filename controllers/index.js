/**
 * Created by 黄蒙蒙 on 2017/3/13.
 */
'use strict'
const Article=require('../models/article')

exports.showIndex=function(req,res,next){
    Article.getAllCount(function(err,count){
        if(err){
            return next(err);
        }
        let pageSize=req.app.locals.config.pageSize;
        console.log(count);
        let totalPage=Math.ceil(count/pageSize);
        res.render('index',{
            user:req.session.user,
            totalPage:totalPage
        });
    });
};