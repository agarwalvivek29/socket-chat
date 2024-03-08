const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { updateUser, createChat, Message, createRoom, joinRoom} = require('./dbops');
const { User, Chat } = require('./db')
const { basic } = require('./routes/router')
const cors = require('cors');
const bodyParser = require('body-parser');

const io = new Server(server,{
    cors : true
});

let users = [];
let messages = [];

app.use(cors());
app.use(bodyParser.json());

app.use('/db',basic);

app.get('/', (req, res) => {
    res.send('Server up and Running');
});


io.on('connection', (socket) => {
    // console.log('newConnection', socket.id);
    users.push(socket.id);
    // console.log(users);

    socket.on('register',async (data)=>{
        const res = await updateUser({
            username : data.username,
            socketId : socket.id
        });
        if(res!=null){
            io.emit('new-user',res);
            // console.log('new-user called');
            // console.log(res);
        }
    })

    socket.on('message',async (data)=>{
        console.log('message');
        console.log(data);

        const owners = await User.find({
            username : { $in : data.owners }
        })

        await Message(data);

        socket.emit('message',{
            chatId : data.chatId,
            message : data.message
        })
        
        console.log(owners,'owners');

        for(let i=0;i<owners.length;i++){
            console.log(owners[i].socketId);
            socket.to(owners[i].socketId).emit('message',{
                chatId : data.chatId,
                message : data.message
            });
        }
    })

    socket.on('create-chat',async(data)=>{
        console.log('create-chat')
        console.log(data);


        const res = await createChat(data);
        console.log(res);

        peerSocketId = res.owner1 == socket.id ? res.owner2 : res.owner1
        console.log(peerSocketId);

        socket.to(peerSocketId).emit('new-chat',res.chat);
        socket.emit('new-chat',res.chat)
    })

    socket.on('create-room',async (data)=>{
        console.log('create-room',data);
        const res = await createRoom(data);
        socket.emit('new-chat',res);
    })

    socket.on('join-room',async (data)=>{
        console.log('join-room');
        console.log(data);

        const res = await joinRoom(data);
        socket.emit('new-chat',res);
        console.log(res);
        
        const user = await User.findOne({
            socketId : socket.id
        })

        const owners =  await User.find({
            username : { $in : res.owners }
        })
        console.log(owners);

        for(let i=0;i<owners.length;i++){
            console.log(owners[i].socketId);
            socket.to(owners[i].socketId).emit('joined-room',{
                chatId : res._id,
                username : user.username
            });
        }
    })

    socket.on('disconnect',()=>{
        const index = users.findIndex(user=>user===socket.id);
        users = users.splice(index,1);
        // console.log('ConnectionLost',socket.id);
        // console.log(users);
    })

});

server.listen(3000, () => {
    console.log('Server active on port : 3000');
});