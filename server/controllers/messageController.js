// get all user accept login user

import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

import { io,userSocketMap } from "../server.js";



export const getUseerForSidebar=async(req,res)=>{


    try{

        const userId=req.user._id;

        const filteredUsers=await User.find({_id:{$ne:userId}}).select("-password");

        // /count number of message not seenr

        const unseenMessage={}
        const promises=filteredUsers.map(async(user)=>{
            const messages=await Message.find({senderId:user._id,receiverId:userId,seen:false})

            if(messages.length>0){
                unseenMessage[user._id]=messages.length;
            }

        })

        await Promise.all(promises);

        res.json({success:true,users:filteredUsers,unseenMessage})


    }
    catch(error){

        console.log(error.message)
        res.json({success:false,message:error.message})


    }
}


// get all messge to selected user


export const getMessages=async(req,res)=>{
    try{

        const {id:selectedUserId}=req.params;

        const myId=req.user._id;

        const messages=await Message.find({
            $or:[
                {senderId:myId,receiverId:selectedUserId},
                {senderId:selectedUserId,receiverId:myId},

            ]

        })


        await Message.updateMany({senderId:selectedUserId,receiverId:myId},{seen:true})


        res.json({success:true,messages})

    }

    catch{

        console.log(error.message)
        res.json({success:false,message:error.message})



    }


    // api to marks messge seen iusenf message

   
}

export const markMessageAsSeen=async(req,res)=>{
try{

    const{id}=req.params;
    await Message.findByIdAndUpdate(id,{seen:true})

    res.json({success:true})



}


catch{

    console.log(error.message)
    res.json({success:false,message:error.message})



}
        
}

// send message to selected user

export const sendMessage=async(req,res)=>{


    try{

        const {text,image}=req.body;

        const receiverId=req.params.id;
        const senderId=req.user._id;

        let imageUrl;

        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image)
                imageUrl=uploadResponse.secure_url;
            
        }

        const newMessage=await Message.create({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })

        // emit the new messge reciver socke

        const receiverSocketId=userSocketMap[receiverId];

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }


        res.json({success:true,newMessage});

    }


    catch{

        console.log(error.message)
        res.json({success:false,message:error.message})
    
    
    
    }
}



