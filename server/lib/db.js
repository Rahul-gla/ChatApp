import mongoose from "mongoose";

// coonect monogdb?


export const connectDB=async()=>{
    try{

        mongoose.connection.on('connected',()=>console.log("Database is connected"))

        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)

    }

    catch(error){

        console.log(error);

    }
}