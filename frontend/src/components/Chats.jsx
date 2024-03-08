import { useRecoilState, useRecoilValue } from 'recoil'
import { currentChatAtom, chatsAtom, userAtom } from '../store'
import Icon from './Icons';
function Chats(){
    const [currentChat, setCurrentChat] = useRecoilState(currentChatAtom);
    const chats = useRecoilValue(chatsAtom);
    const user = useRecoilValue(userAtom);
    let num =0;
    let normalStyle = 'p-2 cursor-pointer'
    let highlightedStyle = 'p-2 cursor-pointer bg-slate-300'
    return(
        <div className='m-2 border-black border min-w-[30vh] lg:1/3 text-center'>
            <div className=''>
                <div className='p-4 text-lg font-medium border-black border'>Chats</div>
                <div className='max-h-[30vh] md:max-h-[79vh] overflow-y-auto'>
                    {chats.length > 0 ? Array.isArray(chats) && chats.map((chat)=>{
                        num+=1;
                        // console.log(chat);
                        return (
                            <div key={num} onClick={()=>{
                                if(currentChat){
                                    if(currentChat._id === chat._id){
                                        setCurrentChat(null);
                                    }
                                    else{
                                        setCurrentChat(chat);
                                    }
                                }
                                else{
                                    setCurrentChat(chat);
                                }

                                
                            }}
                            // className={
                            //     currentChat._id === chat._id ? highlightedStyle : normalStyle
                            // }
                            className={currentChat ? currentChat._id === chat._id ? 'p-2 cursor-pointer bg-slate-300' : "p-2 cursor-pointer" : "p-2 cursor-pointer"}
                            >
                                <div>{ chat.room!==null ? '🗯 ' + chat.room : (chat.owners[0] === user ? chat.owners[1] : chat.owners[0]) }</div>
                                {/* <div>{ chat.unread===0 ? "" : chat.unread }</div> */}
                            </div>
                        )
                    })
                    :
                    <div className='flex-col items-center'>
                        <div className='flex justify-center items-center'>Use the <Icon what='addUserLarge'/><div>Icon</div></div>
                        <div>To Create a Chat with other users</div>
                        <div>or</div>
                        <div>To Create / Join a Room</div>                        
                    </div>             
                
                }
                </div>
            </div>
        </div>
    )
}

export default Chats;