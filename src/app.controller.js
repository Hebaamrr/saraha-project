import {connectionDB} from "./DB/connectionDB.js"
import messageRouter from "./modules/messages/message.controller.js"
import userRouter from "./modules/users/user.controller.js"
import { globalErrorHandler } from "./utils/error/index.js"
import cors from "cors"


const bootstrap=(app,express)=>{
 app.use(cors())
 app.use(express.json())
 connectionDB()
 app.use('/users',userRouter)
 app.use('/messages',messageRouter)
 app.use('*',(request,response,next)=>{
  return next(new Error(`Invalid URL using ${request.originalUrl}`))
  })
   //error handling middleware
  app.use(globalErrorHandler)
}

export default bootstrap