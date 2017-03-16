/**
 * Created by ª∆√…√… on 2017/3/15.
 */
'use strict'

const db=require('./db');

function Comment(comment){
    this.content=comment.content;
    this.aid=comment.aid;
    this.uid=comment.uid;
    this.time=comment.time;
}
Comment.prototype.save=function(callback){
    db.query(`INSERT INTO articles VALUES(NULL,?,?,?,?)`,[
    this.content,
    this.time,
    this.uid,
    this.aid
    ],function(err,result){
        if(err){
            callback(err,null);
        }
        callback(null,result);
    });
};