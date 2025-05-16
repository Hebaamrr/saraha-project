import joi from "joi";
import { generalRules } from "../../utils/generalRules/index.js";



export const signupSchema={
    body: joi.object({
        name: joi.string().alphanum().min(3).max(10).messages({
            "string.min":"name is short" //customized message by type
        }),
        email:generalRules.email,
        password:generalRules.password,
        cPassword:joi.string().valid(joi.ref("password")), 
        gender: joi.string().valid('male','female'),
        phone:joi.string().regex(/^01[0125][0-9]{8}$/),
        // cars:joi.array().items(joi.string()),
        // id:generalRules.objectId
      }).options({presence:"required"}) //all fields required
      .with("password","cPassword").with("email","password"),
    //   query: joi.object({
    //    flag: joi.number().required(),
    //   }),
    //   headers:generalRules.headers.required(),
}

export const signInSchema={
    body: joi.object({
        email:generalRules.email.required(),
        password: generalRules.password.required()
    })
}

export const updateProfileSchema={
    body: joi.object({
        name:joi.string().alphanum().min(3).max(10),
        gender: joi.string().valid('male','female'),
        phone:joi.string().regex(/^01[0125][0-9]{8}$/),
    }),
    headers: generalRules.headers.required(),
}

export const updatePasswordSchema={
    body:joi.object({
        oldPassword:generalRules.password,
        newPassword:generalRules.password,
        cPassword:generalRules.password.valid(joi.ref('newPassword')),   
    }),
    headers: generalRules.headers.required(),
}
export const freezeAccountSchema={
    headers: generalRules.headers.required(),
}

export const shareProfileSchema={
    params:joi.object({
        id:generalRules.objectId.required()
    })
}