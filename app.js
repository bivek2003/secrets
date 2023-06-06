//jshint esversion:6
require('dotenv').config();
const express = require('express');
const body = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const encry = require('mongoose-encryption')
const app = express();
app.set('view engine', "ejs");
app.use(express.static("public"));
app.use(body.urlencoded(
    {extended:true}
));
mongoose.connect("mongodb://127.0.0.1:27017/userDB");
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encry,{secret: process.env.SECRETS, encryptedFields: ["password"] });
const User = mongoose.model("User",userSchema);
app.get("/",function(req,res){
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
    const newuser = new User({
        email: req.body.username,
        password: req.body.password
    });
    try{
        newuser.save();
        res.render("secrets");
    }catch(err){
        console.log(console.log(err));
    }
    
});
app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    try{
        User.findOne({email: username}).then(found =>{
            if(found && found.password === password){
                res.render("secrets");
            }else{
                res.send("404 error Not found 😓");
            }
        })
    }catch(err){
        console.log(err);
    }
    
})












app.listen(3000,function(){
    console.log("Connected at the port 3000");
})