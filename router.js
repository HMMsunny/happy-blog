/**
 * Created by 黄蒙蒙 on 2017/3/13.
 */
'use strict'
const express=require('express');

const router=express.Router();

const indexController=require('./controllers/index');
const userController=require('./controllers/user');
const articleController=require('./controllers/article');
const commentController=require('./controllers/comment');

//展示首页
router.get('/',indexController.showIndex);
//分页
router.get('/page/:pageNumber',articleController.getByPageNumber);
//展示注册页面
router.get('/register',userController.showRegister);
//用户注册
router.post('/register',userController.doRegister);
//展示登陆页面
router.get('/login',userController.showLogin);
//用户登录
router.post('/login',userController.doLogin);
//用户退出
router.get('/logout',userController.doLogout);

//发表文章页面
router.get('/publish/article',articleController.showPublish);

//发表文章
router.post('/publish/article',articleController.doPublish);

//展示发表的文章
router.get('/article/:articleId',articleController.showArticle);

//文件上传
router.post('/article/upload',articleController.uploadImage);

//设置
router.get('/setting/profile',userController.showSeting);

//设置上传图片
router.post('/user/avatar',userController.uploadAvatar);

//评论
router.post('/comment/add/:articleId',commentController.addComment);
module.exports=router;














