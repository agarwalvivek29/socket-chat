import { createContext, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { io } from "socket.io-client";
import { chatsAtom, currentChatAtom, messagesAtom, socketIdAtom, updateChatAtom, userAtom, usersAtom } from "./store";
import { URL } from "./App";
import axios from "axios";
import { Store } from "react-notifications-component";

export const SocketContext = createContext();

const socket = io('https://socket-chat-wuon.onrender.com');

function ContextProvider({children}){
    const [socketId, setSocketId] = useRecoilState(socketIdAtom);
    const user = useRecoilValue(userAtom);
    const [updateChat, setUpdateChat] = useRecoilState(updateChatAtom);
    const [chats,setChats] = useRecoilState(chatsAtom);
    const [currentChat,setCurrentChat] = useRecoilState(currentChatAtom);
    const [users,setUsers] = useRecoilState(usersAtom);

    useEffect(()=>{
        socket.on('connect',()=>{
            console.log(socket.id);
            setSocketId(socket.id);
        })

        socket.on('new-chat',(data)=>{
            // console.log("new-chat called")
            setChats((prev)=>{
                return [...prev,data]
            })
        });

        function updateCurrentChat(data){
            const chat = data[chats].find(obj=> obj._id===data.chatId);
            console.log('updated,chat',chat);

            setCurrentChat(chat);
        }

        socket.on('joined-room',(data)=>{
            console.log('joined-room event');
            console.log(data);
            setChats((prevChats) => {

                const updatedChats = prevChats.map((chat) => {
                    if (chat._id === data.chatId) {
                        return {
                        ...chat,
                        owners : [...chat.owners, data.username]
                        };
                    }
                    return chat;
                });

                console.log(updatedChats);
                return updatedChats;
                
            });
                     
        });

        socket.on('message',async (data)=>{
            console.log(data.message.message);
            // Notification({sender : data.message.sender, message : data.message.message});

            async function chatsUpdate(){
                setChats((prevChats) => {

                    const updatedChats = prevChats.map((chat) => {
                        if (chat._id === data.chatId) {
                            return {
                            ...chat,
                            messages: [...chat.messages, data.message],
                            };
                        }
                        return chat;
                    });
                    
                    return updatedChats;
                })                
            }
            chatsUpdate();
        });

        socket.on('new-user',(newUser)=>{
            setUsers(prev=>[...prev,newUser]);
        })
        
        return ()=>{
            socket.off('new-chat');
            socket.off('new-user');
            socket.off('message');
            socket.off('joined-room');
        }
    },[socket])

    async function sendMessage(data){
        socket.emit('message',{
            chatId : currentChat._id,
            owners : data.owners,
            message : data.message
        })
        
        // console.log(chats);        
    }

    function registerUser(data){
        socket.emit('register',{
            username : data.username
        })
    }

    async function createChat(data){
        socket.emit('create-chat',{
            owners : [user , data.username]
        })
        // console.log(data.username);
    }

    async function createRoom(data){
        socket.emit('create-room',{
            room : data.room,
            creator : user
        })
        alert(`${data.room} created successfully`)
    }

    async function joinRoom(data){
        socket.emit('join-room',{
            room : data.room,
            creator : user
        })
        alert(`${data.room} joined successfully`)
    }

    function Notification({sender,message}){
        Store.addNotification({
            title: sender,
            message: message,
            container: "top-right",
            dismiss: {
                duration: 2000
            }
        });
    }

    return(
        <SocketContext.Provider value={{sendMessage, registerUser, createChat, createRoom, joinRoom}}>
            {children}
        </SocketContext.Provider>
    )
}

export default ContextProvider;