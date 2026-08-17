import { errorCreator } from "./errors.js";
import validator from 'validator';
import { adminCheck } from "./util.js";

 export function emailAuth(email){
    
    let trimEmail = validator.trim(email || "")
        
    let finalEmailCheck = validator.isEmail(trimEmail) && validator.normalizeEmail(trimEmail);

    if(!finalEmailCheck){
       throw errorCreator("Invalid email format", "INVALID_FORMAT", 400) 
    }

    return finalEmailCheck
 };

  export async function updPasswordAuth({id, password, newPassword}){

    if(!password || !id || !newPassword){
        throw errorCreator("Missing filed unable to update password", "MISSING_FIELD", 400)
    }

    if(password === newPassword){
        throw errorCreator("New password ")
    }

    //const hashed_password = await 


 }

 export function requireAdmin(req, res, next){
    const {role} = req.user
    adminCheck(role);
    next();
 }