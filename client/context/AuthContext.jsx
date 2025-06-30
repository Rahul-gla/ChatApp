import { createContext, useEffect, useState } from "react";
import axios from 'axios'

import toast, {Toaster} from 'react-hot-toast'
import { io } from "../../server/server";

const backendUrl=import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL=backendUrl;

export const AuthContext=createContext();

export const AuthProvider=({childeren})=>{

    const[token,setToken]=useState(localStorage.getItem("token"))

    const[authUser,setAuthUsseer]=useState(null);
    const[onlineUser,setOnlineUser]=useState([]);
    const [soket,setSocket]=useState(null)


    const checkAuth=async()=>{
        try{
           const{data}= await axios.get("/api/auth/check")
           if(data.success){
            setAuthUsseer(data.user);

            connectSicket(data.user)
           }

        }
        catch(error){

            toast.error(error.message)


        }
    }


    // login function

    const login=async(state,creditials)=>{
        try{

            const{data}=await axios.post(`/api/auth/${state}`,creditials)

            if(data.success){
                setAuthUsseer(data.userData)

                connectSicket(data.userData)
                axios.defaults.headers.common["token"]=data.token
                setToken(data.token);

                localStorage.setItem("token",data.token)

                toast.success(data.message)
            }
            else{
                toast.error(data.message)
            }


        }

        catch(error){

            toast.error(error.message);

        }
    }


    const logout=async()=>{
        localStorage.removeItem("token")
        setToken(null);
        setAuthUsseer(null);
        setOnlineUser([])
        axios.defaults.headers.common["token"]=null

        toast.success("LoggedOut Succesfully")
        soket.disconnect();

    }

    // update profile

    const updateProfile=async(body)=>{


        try{

            const{data}=await axios.put("/api/auth/update-profile",body)

            if(data.success){
                setAuthUsseer(data.user);

                toast.success("Profile Updated Succesfully")
            }

        }

        catch(error){

            toast.error(error.message)

        }

    }



    // connect sockef fiunction update online user update

    const connectSicket=(userData)=>{
        if(!userData||soket?.connected) return;

        const newSocke=io(backendUrl,{
            query:{
                userId:userData._id,
            }

        })

        newSocke.connect();
        setSocket(newSocke);
        newSocke.on("getOnlineUsers",(userIds)=>{

            setOnlineUser(userIds)
        })
    }


    useEffect(()=>{

        if(token){
            axios.defaults.headers.common["token"]=token;
        }

        checkAuth()

    },[])
    const value={
        axios,authUser,onlineUser,soket,login,logout,updateProfile


    }


    return (
        <AuthContext.Provider value={value}>

            {childeren}
        </AuthContext.Provider>
    )
}