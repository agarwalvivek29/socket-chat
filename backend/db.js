const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_DB_ConnectionString = process.env.MONGODB;

mongoose.connect(MONGO_DB_ConnectionString);

const userSchema = new mongoose.Schema({
    username: String,
    socketId: String,
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }]
});

const chatSchema = new mongoose.Schema({
    room: {
        type: String,
        default: null
    },
    owners: [String],
    messages: [{
        sender: String,
        message: String,
        time: Date
    }],
    unread : {
        type : Number,
        default: 0
    }
});

const roomSchema = new mongoose.Schema({
    title : String,
    owners : [String],
    chatId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Chat'
    }
})

const User = mongoose.model('User', userSchema);
const Chat = mongoose.model('Chat', chatSchema);
const Room = mongoose.model('Room', roomSchema);

module.exports = { User, Chat, Room };
