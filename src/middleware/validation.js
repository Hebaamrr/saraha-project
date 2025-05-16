

export const validation=(schema)=>{
    return (request,response,next)=>{

        let validationResult=[]
     for(const key of Object.keys(schema)){
       const validationError=schema[key].validate(request[key],{abortEarly:false})
        //abortEarly -> wait to rewrite all the existing error at once
        if(validationError?.error){
            validationResult.push(validationError.error.details)
        }
        }
        if(validationResult.length>0){
            return response.status(400).json({message: "Validation error",error:validationResult})
        }

        next()  

      
}
}

//why request[key] not request.key 
//bec key is returned as string 