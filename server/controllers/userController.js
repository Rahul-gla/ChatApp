//  signup new User
import bcrypt from "bcryptjs"
import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";


export const signup=async(req,res)=>{
    const{fullname,email,password,bio}=req.body;

    try{
        if(!fullname||!email||!bio||!password){
            return res.json({success:false,message:"Missing Details"})
        }

        const user=await User.findOne({email});


        if(user){
            return res.json({success:false, message:"account already exits"})
        }

        const salt=await bcrypt.genSalt(10);

        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=await User.create({fullname,email,password:hashedPassword,bio})


        const token=generateToken(newUser._id)

        res.json({success:true, userData:newUser,token,message:"account created succesfully"})

    }
    catch(error){

        res.json({success:false,message:error.message})

    }


}


// controller to login

export const login=async(req,res)=>{
    try{

        const{email,password}=req.body;

        const userData=await User.findOne({email})

        const isPasswordCorrect=await bcrypt.compare(password,userData.password)

        if(!isPasswordCorrect){
            1
        }


    } catch(error){

    }
}

