import { EventEmitter } from "events";
import jwt from "jsonwebtoken"
import { sendEmail } from "../../service/sendEmails.js";
import { generateToken } from "../token/generateToken.js";
export const eventEmitter=new EventEmitter()

eventEmitter.on("sendEmail",async(data)=>{
    const{email}=data
    // const token=jwt.sign({email},process.env.CONFIRM)
    const token=await generateToken({
        payload:{email},
        SECRET_KEY: process.env.CONFIRM,
        option: { expiresIn: "1h" }
    })
   const link=`http://localhost:3000/users/confirmEmail/${token}`

   const emailSender=await sendEmail(email,'Confirm Email',`<a href='${link}'>Confirm </a>`)
   if(!emailSender){
    return response.status(500).json({ message: "Failed to send Email "});
   }
})