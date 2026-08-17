import { Router } from 'express';
import { errorCreator } from '../utils/errors.js';
import tryCatch from '../utils/util.js';
import { getPasswordByUserId, updateUserStatus, updatePassword, createUsername, getUserById, deleteUser } from '../../db/queries/users.js';
import bcrypt from 'bcrypt'
import pool from '../../db/index.js'


const secureUser = Router();


secureUser.patch('/password', tryCatch( async(req, res, next) => {
    const {password, newPassword} = req.body; // recieve the field inputs
    const {id} = req.user // retrieve user from req which is assigned in the authentication middleware 
    const db = req.app.get('db') || pool

    if(!password || !newPassword){ //check to make sure the fields arent empty if they are, throw an error using custom error handler
        throw errorCreator("Missing input fields", "MISSING_FIELDS", 400)
    } else if(password === newPassword){ // check if the new password equals the old password if so throw an error this can be a problem because we havent confirmed the password matches the database
        throw errorCreator("Old password must not match new password", "INVALID_ATTEMPT", 422)
    }

    const hashedPassword = await getPasswordByUserId(id, db) // getting the hashed password from the database, seperate query so user doesnt get comprimised returning a password
     
    const check = await bcrypt.compare(password, hashedPassword) // comparing the password provided to the hashed password from the db in order to authorize the update
    
    if(!check) throw errorCreator("Incorrect password", "INVALID_PASSWORD", 400)

    const hashed_password = await bcrypt.hash(newPassword, 10)

    const result = await updatePassword({id, hashed_password}, db)

    res.status(200).json({message:"Password successfully changed!", tokenVersion: result.toke_version})
}));

secureUser.patch('/status', tryCatch(async(req, res, next) => {
    const {id} = req.user;
    const {status} = req.body;
    const db = req.app.get('db') || pool

    if(typeof status !== 'boolean') throw errorCreator("Incorrect status syntax", "INVALID_SYNTAX", 400)

    const user = await updateUserStatus(id, status, db);

    res.status(200).json({result:user, message:"Successfully updated account status"})


}))

secureUser.patch('/username', tryCatch(async(req, res, next) => {
    const {id} = req.user
    const { username } = req.body
    const db = req.app.get('db')

    if(!username) throw errorCreator("Invalid username", "INVALID_SYNTAX", 400)
    
    const user = await createUsername({id, username}, db)

    res.status(200).json({result:user, message:"Successfully updated username" })
}));

secureUser.delete('/user', tryCatch(async(req, res, next) => {
    const {id} = req.user;
    const {password} = req.body;

    let hashed_password = await getPasswordByUserId(id);

    let isValid = await bcrypt.compare(password, hashed_password)

    if(isValid){
        let deletedUser = await deleteUser(id)
        res.status(200).json({user: deletedUser, message: 'Successfully deleted user' })
    } else {
        throw errorCreator("Incorrect password", 'INVALID_PASSWORD', 403)
    }




}))


export default secureUser;