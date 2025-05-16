import userModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/error/index.js";
import { eventEmitter } from "../../utils/sendEmailsEvents/sendEmail.event.js";
import { Hash,Compare } from "../../utils/hash/index.js";
import { Encrypt,Decrypt } from "../../utils/encryption/index.js";
import { generateToken,verifyToken} from "../../utils/token/index.js";



export const signup =asyncHandler( async (request, response, next) => {
 
  const { name, email, password, cPassword, phone, gender } = request.body;
  
  //check that cpassword is like the password
  if (password !== cPassword) {
    return next(new Error("Password should match the confirmed password.",{cause:400}))
  }
  //check on the email if it exists
  const emailExist = await userModel.findOne({ email });
  if (emailExist) {
    return next(new Error("Email already exists." ,{cause:400}))
  }
  //hashing password
  const hash =await Hash(password)

  // Encrypt phone
  const ciphertext = await Encrypt(phone)

  //send email for verification
   eventEmitter.emit("sendEmail",{email})
  
  //create user
  const user = await userModel.create({
    name,
    email,
    password: hash,
    phone: ciphertext,
    gender,
  });
  return response.status(201).json({ message: "User created", user });

})

export const confirmEmail=asyncHandler(async(request,response,next)=>{

    const{token}=request.params
    if(!token){
      return next(new Error("Token not found",{cause:400}))
    }
    // const decoded=jwt.verify(token,process.env.CONFIRM)
    const decoded=await verifyToken({token,SECRET_KEY:process.env.CONFIRM})
    if(!decoded?.email){
      return next(new Error("Invalid token payload",{cause:400}))
    }

    const user=await userModel.findOneAndUpdate({email:decoded.email,confirmed:false},{confirmed:true})
    if(!user){
      return next(new Error("User not found or already confirmed",{cause:400}))

    }
    return response.status(200).json({ message: "User confirmed"});

 
})

export const signin = asyncHandler(async (request, response, next) => {
 
    const { email, password } = request.body;
    const user = await userModel.findOne({ email,confirmed:true});
    if (!user) {
      return next(new Error("Invalid Email or email not confirmed",{cause:400}))
    }

    const match =await Compare(password,user.password)
    if (!match) {
      return next(new Error("Invalid Password.",{cause:400}))
    }

    const token =await generateToken({
      payload: { email, id: user._id },
     SECRET_KEY: user.role == "user"
      ? process.env.SECRET_KEY_USER
      : process.env.SECRET_KEY_ADMIN,
      option: { expiresIn: "1h" }
    })
    return response.status(201).json({ message: "User signed in", token });
 
})
export const getProfile = asyncHandler(async (request, response, next) => {
    //decrypt phone
    request.user.phone = await Decrypt(request.user.phone)
    return response.status(201).json({ message: "Done", user: request.user });
  
})

export const updateProfile = asyncHandler(async (request, response, next) => {
 if(request.body.phone){
   request.body.phone=await Encrypt(request.body.phone)
 }
 const user=await userModel.findByIdAndUpdate(request.user._id,request.body,{new:true})
  return response.status(200).json({ message: "User updated", user });

})

export const updatePassword=asyncHandler(async(request,response,next)=>{
   const{oldPassword,newPassword}=request.body
   //check oldPassword matching the user password
   const checkPassword=await Compare(oldPassword,request.user.password)
   if(!checkPassword){
    return next(new Error("Invalid old password",{cause:400}))
   }
   const hash= await Hash(newPassword)
   const user=await userModel.findByIdAndUpdate(request.user._id,{password:hash,passwordChangedAt:Date.now()},{new:true})
   return response.status(200).json({ message: "User updated", user });
})

export const freezeAccount=asyncHandler(async(request,response,next)=>{
  //soft delete
  const user=await userModel.findByIdAndUpdate(request.user._id,{isDeleted:true,passwordChangedAt:Date.now()},{new:true})
  return response.status(200).json({ message: "User updated", user });
})

export const shareProfile = asyncHandler(async (request, response, next) => {
  const user=await userModel.findById(request.params.id)
  if(!user){
    return next(new Error("User not found",{cause:404}))
  }
  return response.status(200).json({ message: "Done", user });

})