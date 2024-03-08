const express = require('express');
const { Chat, User } = require("../db");

const basic = express.Router();

basic.get('/users',async (req,res)=>{
    try{
        const users = await User.find();
        res.send(users);
        // console.log(users);
    }
    catch(e){
        // console.log('users',e)
    }
})

basic.post('/chats',async (req,res)=>{
    const username = req.body.username;
    try{
        const user = await User.findOne({
            username
        })
        const chatId = user.chats;

        const chats = await Chat.find({
            _id : { $in : chatId }
        })
        res.send(chats);
        // console.log(chats);
    }
    catch(e){
        // console.log('chats',e);
    }
})

module.exports = { basic };