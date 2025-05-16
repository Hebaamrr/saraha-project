import mongoose from "mongoose";
import { roles } from "../../middleware/auth.js";

export const enumGender={
    male:"male",
    female:"female"
}

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        lowercase: true,
        minLength:[3,'Name is short'],
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique: true,
        match: /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/
    },
    password:{
        type:String,
        required:true,
        minLength:3
    },
    phone:{
     type: String,
     required: true
    },
    gender:{
        type:String,
        required:true,
        enum: Object.values(enumGender)
    },
    confirmed:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:Object.values(roles), //array of values
        default:roles.user

    },
    passwordChangedAt: Date,
    isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true,
})

const userModel=mongoose.models.User || mongoose.model("User",userSchema)
export default userModel