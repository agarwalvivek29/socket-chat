import { useContext, useState } from "react"
import { SocketContext } from "../SocketContext"
import Messages from "../components/Message";
import { useRecoilValue, useRecoilState } from "recoil";
import { currentChatAtom, socketIdAtom, userAtom } from "../store";
import Users from "../components/Users";
import Chats from "../components/Chats";

function Main(){
    const user = useRecoilValue(userAtom);    

    return(
        <div className="w-screen md:w-3/4">
            <div className="overflow-x-hidden">
                <div>
                    <div className="text-center text-xl p-2">{user}'s Chats</div>
                    <Users />
                    <div className="md:flex">
                        <Chats />
                        <Messages />
                        <div className="w-20"></div>
                    </div>
                 </div>
            </div>
        </div>

    )
}

export default Main;

