import joi from "joi";
import { generalRules } from "../../utils/generalRules/index.js";

export const sendMessageSchema={
    body:joi.object({
    content:joi.string().min(1).required(),
    userId:generalRules.objectId.required()
    })
}