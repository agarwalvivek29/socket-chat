const { Socket } = require('socket.io');
const { User, Chat, Room } = require('./db');
const mongoose = require('mongoose');

async function updateUser(data){
    try{
        const user = await User.findOne({
            username : data.username
        })
        if(user){
            user.socketId = data.socketId;
            await user.save();
            // console.log(user);
        }
        else{
            const newUser = new User({
                username : data.username,
                socketId : data.socketId
            })
            await newUser.save();
            return newUser;
        }
    }
    catch(e){
        console.log("updateUser",e)
    }
    return null;
}

async function createChat(data){
    try{
        const chat = new Chat({
            owners : data.owners,
            messages : []
        })

        await chat.save();

        const user1 = await User.findOne({
            username : data.owners[0]
        })

        const user2 = await User.findOne({
            username : data.owners[1]
        })

        user1.chats.push(chat._id);
        user2.chats.push(chat._id);

        await user1.save();
        await user2.save();

        // console.log(chat);
        // console.log(user1);
        // console.log(user2);

        return {
            chat,
            owner1 : user1.socketId,
            owner2 : user2.socketId
        };
    }
    catch(e){
        // console.log("createChat",e);
    }
}

async function Message(data){
    try{
        const chat = await Chat.findById(data.chatId);
        chat.messages.push(data.message);
        chat.unread+=1;
        chat.save();
    }
    catch(e){
        console.log("Message",e);
    }
}

async function createRoom(data){
    try{
        const existingRoom = await Room.findOne({
            title : data.room
        })

        if(existingRoom){
            return joinRoom(data)
        }

        const chat = new Chat({
            room : data.room,
            owners : [data.creator],
            messages : []
        })

        await chat.save();
        // console.log(chat);

        const user = await User.findOne({
            username : data.creator
        })
        // console.log(user);
        user.chats.push(chat._id);

        await user.save();

        const room = new Room({
            title : data.room,
            chatId : chat._id
        })

        await room.save();

        return chat;
    }
    catch(e){
        console.log("createRoom",e);
    }
    return null;
}

async function joinRoom(data){
    try{
        const room = await Room.findOne({
            title : data.room
        })

        if(!room){
            return createRoom(data)
        }

        const chat = await Chat.findOne({
            _id : room.chatId
        })

        chat.owners.push(data.creator)
        await chat.save();

        const user = await User.findOne({
            username : data.creator
        })
        user.chats.push(chat._id);
        await user.save();

        return chat;
    }
    catch(e){
        console.log('joinRoom',e);
    }
    return null
}

module.exports = { updateUser , createChat, Message, createRoom, joinRoom};