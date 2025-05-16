import { response } from "express";
import messageModel from "../../DB/models/message.model.js";
import userModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/error/index.js";

export const sendMessage=asyncHandler(async(request,response,next)=>{
   const {content,userId}=request.body
   if(!await userModel.findOne({_id:userId,isDeleted:false})){
     return next(new Error("User not found"))
   }
   const message=await messageModel.create({content,userId})
   return response.status(201).json({message:"Done",message})
})


export const getMessages=asyncHandler(async (request,response,next)=>{
    const messages=await messageModel.find({userId:request.user._id}).populate('userId','name')
    return response.status(200).json({message:"Done",messages})
})
