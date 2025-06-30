import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";


const app=express();

const server=http.createServer(app)


// iniliazze sokect server

export const io=new Server(server,{
    cors:{origin:"*"}
})

// store online user

export const userSocketMap={};


// socket io connectiion handeler

io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId;

    console.log("User connectess",userId);

    if(userId){
        userSocketMap[userId]=socket.id
    }


    // emi online user 

    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    // 

    socket.on("disconnect",()=>{
        console.log("user disconnected",userId);

        delete userSocketMap[userId];

        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })

})

// middleware


app.use(express.json({limit:"4mb"}))

app.use(cors());
app.use("/api/status",(req,res)=>res.send("server is Live"))
// route setup
app.use("/api/auth",userRouter)

app.use("/api/messages",messageRouter)



// connect to mongodb

await connectDB();

const PORT= process.env.PORT||5000;

server.listen(PORT,()=> console.log("Server runnig at port"+ PORT));