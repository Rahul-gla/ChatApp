import { createContext, use, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";




export const ChatContext=createContext();


export const ChatProvider=({children})=>{

    const[messages,setMessages]=useState([]);
    const[users,setUsers]=useState([]);

    const[selectedUser,setSelectedUsser]=useState(null);
    const[unseenMessages,setUnseenMessages]=useState({})

    const {socket,axios}=useContext(AuthContext);

    // function to get alluser in sidebar

    const getUser=async()=>{
        try{

          const{data}=  await axios.get("/api/messages/users")
          if(data.success){
            setUsers(data.users)

            setUnseenMessages(data.unseenMessages)

          }

        }

        catch(error){

            // console.log(
            
        toast.error(error.message)

        }
    }


    // get messge to selected user

    const getMessages=async()=>{
        try{

         const{data}=   await axios.get(`/api/messages/${userId}`);

         if(data.success){
            setMessages(data.messages)
         }

        }


        catch(error){

            // console.log(
            
        toast.error(error.message)

        }
    }


    // senfd messge to select user

    const sendMessage=async()=>{

        try{

            const{data}=await axios.post(`/api/messages/send/${selectedUser._id}`,messageData)

            if(data.success){
                setMessages((prevMessages)=>[...prevMessages,data.newMessage])
            }
            else{
                toast.error(error.message)


            }



        }

        catch(error){

            // console.log(
            
        toast.error(error.message)

        }
    }


    // subbscribe messge to selected user


    const subscribeToMessage=async()=>{
        if(!socket) return;


        socket.on("newMessage",(newMessage)=>{

            if(selectedUser&&newMessage.senderId===selectedUser._id){
                newMessage.seen=true;

                setMessages((prevMessages)=>[...prevMessages,newMessage])

                axios.put(`/api/messages/mark/${newMessage._id}`);
            }

            else{
                setUnseenMessages((preUnseenMessages)=>({
                    ...preUnseenMessages,[newMessage.senderId]:preUnseenMessages[newMessage.senderId]?preUnseenMessages[newMessage.senderId]+1:1

                }))
            }

        })
    }

// function to unsubscribe from messages

const unsubscribeFromMessages=()=>{
    if(socket) socket.off("newMessage");



}

useEffect(()=>{

    subscribeToMessage();
    return()=> unsubscribeFromMessages();

},[socket,selectedUser])


const value={

    messages,users,selectedUser,getUser,setMessages,sendMessage,setSelectedUsser,
    unseenMessages,setUnseenMessages



}

    return(

        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}