import { Router } from "express";
import * as US from "./user.service.js";
import * as UV from "./user.validation.js";
import { authentication, authorization, roles } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";

const userRouter=Router()

userRouter.post('/signup',validation(UV.signupSchema),US.signup)
userRouter.post('/signin',validation(UV.signInSchema),US.signin)
userRouter.get('/confirmEmail/:token',US.confirmEmail)
userRouter.get('/profile',authentication,authorization([roles.user]),US.getProfile)
userRouter.patch('/update',validation(UV.updateProfileSchema),authentication,US.updateProfile)
userRouter.patch('/update/password',validation(UV.updatePasswordSchema),authentication,US.updatePassword)
userRouter.delete('/freeze',validation(UV.freezeAccountSchema),authentication,US.freezeAccount)
userRouter.get('/shareprofile/:id',validation(UV.shareProfileSchema),US.shareProfile)


export default userRouter

//validation() -> when it is a middle ware and its a normal function so it could take arguments and return req,res,next at the same time