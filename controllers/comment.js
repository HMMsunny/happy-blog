/**
 * Created by 黄蒙蒙 on 2017/3/15.
 */
'use strict'
const Comment=require('../models/comment');
const moment=require('moment');
moment.locale('zh-cn');




exports.addComment=function(req,res,next){
   // console.log(req);
    //接受用户提交的数据
    let aid=req.params.articleId;
    let content=req.body.content;
    let time = moment().format('YYYY-MM-DD HH:mm:ss');
    let uid=req.session.user.id;

   // console.log('1');
   // console.log(content);
   let comment=new Comment({
       content,
       time,
       uid,
       aid
   });


comment.save(function(err,result){
    if(err){
        return next(err);
    }
    console.log(result);
});




}