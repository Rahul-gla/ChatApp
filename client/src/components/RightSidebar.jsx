import React, { useContext, useEffect, useState } from 'react';
import assets, { imagesDummyData } from '../assets/assets';
import { ChatContext } from '../../context/chatContext';
import { AuthContext } from '../../context/AuthContext';

const RightSidebar = () => {


  const {selectedUser,messages}=useContext(ChatContext)
  const {logout,onlineUsersData}=useContext(AuthContext)

  const[messageImages,setMessageImages]=useState([]);

  //  get all image from the messages and set to them

  useEffect(()=>{
    setMessageImages(

      messages.filter(msg=>msg.image).map(msg=>msg.image)

    )

  },[messages])

  
  return selectedUser && (
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-auto ${!selectedUser ? "max-md:hidden" : ""}`}>
      {/* Profile Section */}
      <div className='pt-16 flex flex-col items-center gap-4 text-xs font-light mx-auto'>
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt="Profile"
          className='w-20 aspect-[1/1] rounded-full object-cover'
        />
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>

          {onlineUsersData.includes(selectedUser._id)&&
          <p className='w-2 h-2 rounded-full bg-green-500'></p>}
          {selectedUser.fullName}
        </h1>
        <p className='px-10 mx-auto text-center'>{selectedUser.bio}</p>
      </div>

      <hr className='border-[#ffffff50] my-4' />

      {/* Log Out Button (above Media section) */}
      <div className='px-5'>
        <button 

        onClick={()=>logout()}
        
        className='w-full bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-lg font-medium py-4 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-200 '>
          Log Out
        </button>
      </div>

      {/* Media Section */}
      <div className='px-5 text-xs flex-1'>
        <p className='font-semibold'>Media</p>
        <div className='mt-2 max-h-[200px] overflow-y-auto grid grid-cols-2 gap-4 opacity-80'>
          {messageImages.map((url, index) => (
            <div key={index} onClick={() => window.open(url)} className='cursor-pointer rounded overflow-hidden'>
              <img
                src={url}
                alt="Media"
                className='h-full w-full object-cover rounded-md transition-transform duration-300 transform hover:scale-105'
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
