import { useRecoilState, useRecoilValue } from 'recoil';
import { chatsAtom, currentChatAtom, updateChatAtom, userAtom, usersAtom } from "../store";
import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../SocketContext';
import Icon from './Icons';

function Users(){
    const me = useRecoilValue(userAtom);
    const users = useRecoilValue(usersAtom);
    const chats = useRecoilValue(chatsAtom);
    const { createChat } = useContext(SocketContext);
    const [isShown, setIsShown] = useState(false);
    const [search, setSearch] = useState('')
    const [filteredUsers, setFilteredUsers] = useState([]);
    
    async function findChat(username){
        const result = chats.filter(obj => obj.owners.includes(username) && obj.owners.includes(me) && obj.room===null);
        if(result.length>0){
            alert('Chat already Exists');
        }
        else{
            // console.log(username)
            const res = await createChat({
                username
            })
            alert('Chat created');
        }
    }

    useEffect(()=>{
        if(users && Array.isArray(users)){
            setFilteredUsers(
                users.filter((obj) => {
                    let x = obj.username
                    // console.log(x);
                    return x!==null && x.includes(search)
                })
            )
            // console.log(filteredUsers);
        }
    },[search])
    

    return(
        <div>
            {isShown && <div className='m-2 fixed inset-0 flex flex-col items-center justify-center bg-white' >
                <div className='md:w-1/4 h-2/3 flex-col items-center border-black border-2 overflow-y-auto text-center'>
                <div className='p-4 border border-black text-center'>Users</div>
                <Search setSearch={setSearch}/>
                <CreateRoom />
                <JoinRoom />
                {search === '' ?
                Array.isArray(users) && users.map((user)=>{
                    return (
                        <div key={user.username} onClick={async()=>{
                            await findChat(user.username);
                            setIsShown(false);
                        }}
                        className='p-2 cursor-pointer hover:bg-slate-200'
                        >{user.username}</div>
                    )
                })
                :
                filteredUsers.length > 0 ? 
                Array.isArray(filteredUsers) && filteredUsers.map((user)=>{
                    return (
                        <div key={user.username} onClick={async()=>{
                            await findChat(user.username);
                            setIsShown(false);
                        }}
                        className='p-2 cursor-pointer'
                        >{user.username}</div>
                    )
                })
                :
                <div className='p-2'>No user found</div>
                }
            </div>
            </div>}
            <div className='absolute top-0 right-0 cursor-pointer md:m-5 m-2' onClick={()=>{
                setIsShown(!isShown);
            }}>
                <Icon what="addUserLarge" />
            </div>
            <div className='absolute md:top-20 md:right-0 top-0 right-14 cursor-pointer md:m-5 m-2' onClick={()=>{
                window.location.reload();
            }}>
                <Icon what="exitLarge" />
            </div>
        </div>
    )
}

function Search({setSearch}){
    
    return(
        <div className='flex p-1'>
            <input className='p-2 w-3/4 outline-none border-black border-b'
            placeholder='Search Users....'
            onChange={(e)=>{
                setSearch(e.target.value);
            }}
            />
            <button className='p-1 text-center w-1/4'
            onClick={()=>{
                
            }}
            >🔍 Search</button>
        </div>
    )
}


function CreateRoom(){

    const [room,setRoom] = useState('');
    const { createRoom } = useContext(SocketContext);
    return(
        <div className='flex p-1'>
            <input className='p-2 w-3/4 outline-none border-black border-b'
            placeholder='Create a Room'
            onChange={(e)=>{
                setRoom(e.target.value);
            }}
            />
            <button className='p-1 text-center w-1/4'
            onClick={()=>{
                if(room!==''){
                    createRoom({
                        room
                    })
                }
            }}
            >➕ Create</button>
        </div>
    )
}

function JoinRoom(){

    const [room,setRoom] = useState('');
    const { joinRoom } = useContext(SocketContext);
    return(
        <div className='flex p-1'>
            <input className='p-2 w-3/4 outline-none border-black border-b'
            placeholder='Join a Room'
            onChange={(e)=>{
                setRoom(e.target.value);
            }}
            />
            <button className='p-1 text-center w-1/4'
            onClick={()=>{
                if(room!==''){
                    joinRoom({
                        room
                    })
                }
            }}
            >⏩ Join</button>
        </div>
    )
}

export default Users;