import { useRecoilState, useRecoilValue } from "recoil";
import { chatsAtom, currentChatAtom, messagesAtom, userAtom } from "../store";
import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../SocketContext";

function Message({data}){
    const user = useRecoilValue(userAtom);
    // console.log(data);
    return(
        <div className="m-3 p-2">
            <div className={ data.sender === user ? "text-right" : "text-left" }>
                <div className="p-1 font-light text-sm">{data.sender}</div>
                <div className="text-lg p-1">{data.message}</div>
                <div className="text-xs font-light">{data.time.substring(0,10) + " " + data.time.substring(11,16)}</div>
            </div>
        </div>
    )
    
}

function MessageArray(){
    const currentChat = useRecoilValue(currentChatAtom);
    let num = 0;
    const lastMessage = useRef(null);

    useEffect(()=>{
        if(lastMessage.current){
            lastMessage.current.scrollIntoView({ behavior : 'smooth' })
        }
    },[currentChat]);

    return(
        <div className="max-h-[40vh] md:max-h-[75vh] overflow-y-auto">
            {
                currentChat.messages.length > 0 ? (
                    currentChat.messages.map((message)=>{
                        num+=1
                        return <Message key={num} data={message} />
                    })
                )
                :
                (
                    <div className="p-3">
                        Send your First message....
                    </div>
                )
            }
            <div ref={lastMessage} />
        </div>
    )
}

export function MessageInput(){

    const currentChat = useRecoilValue(currentChatAtom);
    const [message,setMessage] = useState('');
    const { sendMessage } = useContext(SocketContext);
    const user = useRecoilValue(userAtom)

    function handleSend(){
        sendMessage({
            message : {
                sender : user,
                time : new Date(),
                message
            },
            owners : currentChat.owners
        });
        setMessage('');
    }

    return(
        <div className="border-black border-2 flex">
            <input type="text-area" placeholder="message" className="p-5 w-full outline-none resize-none h-auto" onChange={(e)=>{
                setMessage(e.target.value)
            }}
            />
            <button onClick={()=>{
                if(message!=''){
                    handleSend();
                }
            }} className="p-5 border-black border">Send</button>
        </div>
    )
}

function Messages(){
    const [currentChat, setCurrentChat] = useRecoilState(currentChatAtom);
    const chats = useRecoilValue(chatsAtom);
    const user = useRecoilValue(userAtom);

    useEffect(()=>{
        if(currentChat){
            let newChat = chats.find(obj=>obj._id===currentChat._id);
            setCurrentChat(newChat);
        }
    },[chats])

    return (
        currentChat ? (
        <div className="m-2 border-black border md:w-2/3 flex flex-col">
            <div className="p-4 border-black border text-xl text-center">{currentChat ? currentChat.room ? '🗯 ' + currentChat.room : currentChat.owners[0] ===user ? currentChat.owners[1] : currentChat.owners[0] : "Messages"}</div>
            {currentChat.room ? <div className="p-3">Members : {JSON.stringify(currentChat.owners)}</div> : ""}
            <MessageArray />
            <div className="flex-grow"></div>
            <MessageInput />
        </div>
        )
        :
        ("")
    )
}

export default Messages;