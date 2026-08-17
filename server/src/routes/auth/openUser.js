import bcrypt from 'bcrypt'
import { errorCreator } from '../utils/errors.js'
import { Router } from 'express'
import tryCatch from '../utils/util.js';
import { getPasswordByUserId, createUser, getUserByEmail} from '../../db/queries/users.js';
import jwt from 'jsonwebtoken';
import { emailAuth } from '../utils/autho.js';
import pool from '../../db/index.js';


const openUsers = Router();


openUsers.post('/', tryCatch( async(req, res, next) => {
    const client = req.app.get('db') || pool;
    const {password, email} = req.body;
    
    if(!password || !email) throw errorCreator("Missing fields", "INVALID_INPUT", 400)

    const normalizedEmail = emailAuth(email)
    const hashed_password = await bcrypt.hash(password, 10)

    const userData = await createUser({hashed_password, email:normalizedEmail}, client)

    const token =  jwt.sign({role:userData.role, id:userData.id, tokenVersion:userData.toke_version}, process.env.SECRET_KEY, {expiresIn:"1h"})

    

    res.status(201).json({user:userData, token, message:"You've successfully created an account" });
}));

//Next create the login route for tommorrow should be fast


openUsers.post('/signin', tryCatch( async(req, res, next) => {
    const client = req.app.get('db') || pool;
    const {email, password} = req.body;
    

    if(!email || !password){
        throw errorCreator("Missing fields", "MISSING_FIELDS", 400)
    };


    const validatedEmail = emailAuth(email)

    const user = validatedEmail && await getUserByEmail(validatedEmail, client);

    const hashedPassword = await getPasswordByUserId(user.id, client);


    const valid = await bcrypt.compare(password, hashedPassword);

    if(!valid) throw errorCreator("Incorrect password try again", "INVALID_PASSWORD", 401)

    const token = jwt.sign({role:user.role, id:user.id, tokenVersion:user.toke_version}, process.env.SECRET_KEY)

    

    res.status(201).json({message:"Log in successful",  user, token})


}) )

// Looks like everything is good but i might need to add a email verifcation as the last step for the back end set up, this will be for extra secuirty when logging in






export default openUsers;