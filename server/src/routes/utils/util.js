import { errorCreator } from "./errors.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { createUser, getUserById } from "../../db/queries/users.js";
import pool from "../../db/index.js";

export default function tryCatch(fn){
    return async function (req, res, next){
        try{
            return await fn(req,res, next)
        } catch(err){
            console.log(err)
            next(err)
        }
    }
 };

export function retrieveToken(tokenString){ 
    if(!tokenString) throw errorCreator("No token present", "ACCESS_DENIED", 401); 

    let cleanTokenString = tokenString.trim() 
    let bearerPrefix = cleanTokenString.substring(0,7).toLowerCase();

    if(bearerPrefix === "bearer "){ 
        let stringArr = cleanTokenString.split(" ").filter(arr =>  arr !== '' ) 
        
        if(stringArr.length < 2) throw errorCreator("Invalid token syntax", "INVALID_SYNTAX", 401) 
            
        return stringArr[1] 
    } else {
        throw errorCreator("Missing Bearer","INVALID_TOKEN", 401) ;

    }
}

export async function privateCheck(req, res, next){
    const db = req.app.get('db') || pool;
    let token = retrieveToken(req.headers.authorization);
    

    try{
        const payload = jwt.verify(token, process.env.SECRET_KEY)
       
        const user = await getUserById(payload.id, db)
        
        if(user.toke_version !== payload.tokenVersion) throw errorCreator("Session expired", "INVALID_SESSION", 403)

        if(user.is_locked === true || user.is_active === false) throw errorCreator("User is not active", "INVALID_ATTEMPT", 403)

        req.user = payload;

        next();

    } catch(err){
        console.log(err)
       throw err
    }
};

export function publicCheck(req, res, next){
    if(!req.headers.authorization){
        return next()
    }else {
        throw errorCreator("No authorization need", "INVALID_REQUEST", 400)
    }
}


export function adminCheck(role){
    
    if(role !== 'admin') throw errorCreator("Not authorized, not admin", "INVALID_PERMISSION", 403)
}

export function createUserTokenTest(user){

    let token = user ? jwt.sign({id:user.id, role:user.role, tokenVersion:user.toke_version}, process.env.SECRET_KEY) : jwt.sign({id:1, role:'admin', tokenVersion:0, test: true}, process.env.SECRET_KEY)

    return token
}

export async function createNewUser(email, password, client){
    const hashedPassword = await bcrypt.hash(password, 1)

    const user = await createUser({email, hashed_password: hashedPassword}, client)

    return user
};



export async function updateRole(userId, role, db = pool){
     const {rows:[user]} = await db.query(`
        UPDATE users
        SET role = $1
        WHERE id = $2
        RETURNING*
        `, [role, userId])
        return user
};

export async function updateReportStatus(status, id, db = pool){
    const {rows:[updPost]} = await db.query(`
        UPDATE reports
        SET status = $1
        WHERE id = $2
        RETURNING *
        `, [status, id])

        if(!updPost) throw errorCreator("Report not found", "INVALID_ID", 404)
        
        return updPost
}

export async function transactionStart(dbPool, app){
    let client = await dbPool.connect();
    await client.query('BEGIN')
    
    if(app) app.set('db', client)

    return client

}

export async function transactionEnd(client, app){
        if(!client) return
    try{
        await client.query('ROLLBACK')
    } finally{
        client.release()
        if(app) app.set('db', null)
    }
};




export async function requestHelper(request, method, url, userToken, {body, status = 200} = {}){
    
        let res = request[method](url)
        if(userToken) res = res.set('Authorization', `Bearer ${userToken}`)
        if(body) res = res.send(body)
        res = res.expect(status)
        res = res.expect('Content-Type', /json/)
        
        return res

     
};

