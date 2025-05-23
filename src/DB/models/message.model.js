import mongoose from "mongoose";
//two types of relations -> embedded or by reference(FK) 

const messageSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

},{
    timestamps:true
})

const messageModel=mongoose.models.Message || mongoose.model("Message",messageSchema)
export default messageModel