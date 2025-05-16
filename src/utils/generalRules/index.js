import joi from "joi"
import { Types } from "mongoose"

export let customId=(value,helper)=>{ //dynamic validation
    let data=Types.ObjectId.isValid(value) //to be updated if there is any update in the id in mongoose
   return data ? value : helper.message("id is not valid")
}

export const generalRules={
    objectId: joi.string().custom(customId),  // customized validaton
    email:joi.string().email({tlds:{allow:['com','org']},minDomainSegments:2}),//top level domain -> tlds
    password:joi.string().regex(/(?=.*[A-Z])(?=.*[!@#\$%])/),
    headers: joi.object({
        auth:joi.string().required(),
        'cache-control':joi.string(),
        'postman-token':joi.string(),
        'content-type':joi.string(),
        'content-length':joi.string(),
         host:joi.string(),
        'user-agent':joi.string(),
        accept:joi.string(),
        'accept-encoding':joi.string(),
        connection:joi.string(),
      })
}