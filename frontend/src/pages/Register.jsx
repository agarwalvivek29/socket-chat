import { useRecoilState } from "recoil";
import { registerAtom, userAtom } from "../store";
import { useState, useContext } from "react";
import { SocketContext } from "../SocketContext";
import { z } from 'zod';

const myschema = z.string().min(3);

function Register(){
    const [register,setRegister] = useRecoilState(registerAtom);
    const [user,setUser] = useRecoilState(userAtom)

    const { registerUser } = useContext(SocketContext);

    return(
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="text-3xl font-mono font-medium p-3">Socket-Chat</div>
            <div className="border border-black w-min p-5 flex flex-col items-center justify-center">
                <div>
                    <input placeholder="Username" className="p-3 border-black border-b outline-none" onChange={(e)=>{
                        setUser(e.target.value);
                    }} />
                </div>
                <button className="p-3 text-center " 
                    onClick={()=>{
                    if(myschema.safeParse(user).success){
                        registerUser({
                            username : user
                        });
                        setRegister(true);
                    }
                    else{
                        alert('Username should be atleast 3 characters');
                    }   
                    console.log(user);
                    
                }}>Register</button>
            </div>
        </div>
    )
}

export default Register;

