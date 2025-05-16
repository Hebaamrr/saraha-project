import jwt from "jsonwebtoken";
import userModel from "../DB/models/user.model.js";
import { asyncHandler } from "../utils/error/index.js";

export const roles = {
  user: "user",
  admin: "admin",
};

export const authentication =asyncHandler( async (request, response, next) => {
  const { auth } = request.headers;

  const [prefix, token] = auth.split(" ") || [];

  if (!prefix || !token) {
    return next(new Error("Token is required.",{cause:401}))
  }
  let SIGN_TOKEN = undefined;

  if (prefix == "admin") {
    SIGN_TOKEN = process.env.SECRET_KEY_ADMIN;
  } else if (prefix == "bearer") {
    SIGN_TOKEN = process.env.SECRET_KEY_USER;
  } else {
    return next(new Error("Invalid Token prefix",{cause:401}))
  }

  const decoded = jwt.verify(token, SIGN_TOKEN); //return{payload}
  if (!decoded?.id) {
    return next(new Error("Invalid Token Payload." ,{cause:403}))
  }
  const user = await userModel.findById(decoded.id);
  if (!user) {
    return next(new Error("User not found.",{cause:404}))
  }
  if(user?.isDeleted){
    return next(new Error("User deleted",{cause:401}))
  }
  //check the time when the password changed and when the token initiated
  if(parseInt(user?.passwordChangedAt.getTime()/1000) > decoded.iat){
     return next(new Error("Token expired, please login again.",{cause:401}))
  }
  
  request.user = user;
  next();

})

export const authorization = (accessRoles = []) => {
  return asyncHandler(async (request, response, next) => {
      //authorization
      if (!accessRoles.includes(request.user.role)) {
        return next(new Error( "Access denied.",{cause:403}))
      }
      next();
  })
}
