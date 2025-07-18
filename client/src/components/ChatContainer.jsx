import React, { useContext, useEffect, useRef, useState } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/chatContext";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const ChatContainer = () => {

  const {messages,selectedUser,setSelectedUser,sendMessage,getMessages,}=useContext(ChatContext);
  const {authUser,onlineUsers}=useContext(AuthContext);




  const scrollEnd = useRef();
  

  const[input,setInput]=useState("");

  // handle sending a message
  const handleSendMessage=async(e)=>{
    e.preventDefault();
    if(input.trim()==="") return null;

    await sendMessage({text:input.trim()})
    setInput("");




  }
// hamdle sending a image
  const  handleSendImage=async(e)=>{
    const file=e.target.files[0];

    if(!file||!file.type.startsWith("image/")){
      toast.error("select an image file")
      return;
    }

    const reader=new FileReader();

    reader.onloadend=async()=>{
      await sendMessage({image:reader.result})
      e.target.value="";
    }

    reader.readAsDataURL(file)

  }


  useEffect(()=>{

    if(selectedUser){
      getMessages(selectedUser._id)
    }

  },[selectedUser])

  useEffect(() => {
    if (scrollEnd.current&&messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Added dependency to ensure scrolling works when messages change

  return selectedUser ? (
    <div className="h-full overflow-hidden relative backdrop-blur-lg">
      <div className="flex items-center gap-3 py-3 border-b border-stone-500">
        <img src={selectedUser.profilePic||assets.avatar_icon} alt="" className="w-8 rounded-full" />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {/* Martin Johnson
          
          */}

          {selectedUser.fullName}
         {onlineUsers.includes(selectedUser._id)&& <span className="w-2 h-2 rounded-full bg-green-500"></span>}
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden w-7 cursor-pointer"
        />
        <img src={assets.help_icon} alt="" className="hidden md:block w-5" />
      </div>

      {/* Chat area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-auto p-3 pb-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== authUser._id ? "flex-row-reverse" : ""
            }`}
          >
            {msg.image ? (
              <img
                src={assets.image}
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-2"
                alt="Message"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-2 break-all bg-violet-500/30 text-white ${
                  msg.senderId === authUser._id ? "rounded-br-none" : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}

            <div className="text-center text-xs">
              <img
                src={msg.senderId === authUser._id ? authUser?.profilePic|| assets.avatar_icon : selectedUser ?.profilePic ||assets.avatar_icon}
                alt=""
                className="w-7 rounded-full"
              />
              <p className="text-gray-500">{formatMessageTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}

        <div ref={scrollEnd}></div>
      </div>

      {/* Message input area */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-tl-xl rounded-tr-xl">
        <div className="flex-1 flex items-center bg-transparent px-3 py-2 rounded-full border border-gray-500/50">
          <input 
          onChange={(e)=>setInput(e.target.value)}
          value={input}
          onKeyDown={(e)=>e.key==="Enter"?handleSendMessage(e):null}
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 bg-transparent text-white placeholder-gray-400 rounded-full focus:outline-none"
          />
          <input

          onChange={handleSendImage}
          
          type="file" id="image" accept="image/png, image/jpeg" hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="Gallery" className="w-5 mr-2 cursor-pointer hover:opacity-80 transition-opacity" />
          </label>
        </div>

        <img

        onClick={handleSendMessage}
          src={assets.send_button}
          alt="Send"
          className="w-8 h-8 rounded-full bg-violet-500 hover:bg-violet-600 transition duration-200 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
      <img src={assets.logo_icon} alt="" className="max-w-16" />
      <p className="text-lg font-medium text-white">Chat Anytime, Anywhere</p>
    </div>
  );
};

export default ChatContainer;
