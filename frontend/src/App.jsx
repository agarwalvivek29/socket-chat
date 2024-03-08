import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil"
import { ReactNotifications } from 'react-notifications-component';
import ContextProvider from "./SocketContext"
import Main from "./pages/Main"
import Register from "./pages/Register"
import { chatsAtom, currentChatAtom, registerAtom, updateChatAtom, userAtom, usersAtom } from "./store"
import { useEffect } from "react"
import axios from "axios"

// export const URL = 'http://localhost:3000';
export const URL = 'https://socket-chat-wuon.onrender.com';

function App() {

    const [users, setUsers] = useRecoilState(usersAtom);
    const [chats, setChats] = useRecoilState(chatsAtom);
    const user = useRecoilValue(userAtom);
    const register = useRecoilValue(registerAtom);
    const currentChat = useRecoilValue(currentChatAtom);

    useEffect(()=>{
        async function init(){
            if(register){
                try{
                    const res = await axios.get(`${URL}/db/users`);
                    console.log(res.data);
                    setUsers(res.data);

                    const res1 = await axios.post(`${URL}/db/chats`,{
                        username : user
                    })
                    console.log(res1.data);
                    setChats(res1.data);
                }
                catch(e){
                    console.log('init',e);
                }                
            }
        }
        init();
    },[register])



    return (
        <ContextProvider>
            {register ? <Main /> : <Register />}
            <ReactNotifications />
        </ContextProvider>
    )
}

export default App;