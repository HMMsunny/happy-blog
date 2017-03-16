/**
 * Created by ª∆√…√… on 2017/3/13.
 */
'use strict'

const path=require('path');

module.exports={
    debug: true,
    secret:'happyblog',
    pageSize:5,
    uploadDir:path.join(__dirname,'uploads'),
    avatarDir: path.join(__dirname,'uploads/avatar')

};