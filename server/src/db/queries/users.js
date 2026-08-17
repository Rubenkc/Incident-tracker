import { errorCreator } from '../../routes/utils/errors.js';
import pool from '../index.js';



export async function createUser({email, hashed_password}, db = pool){
   
        const {rows:[user]} = await db.query(`
            INSERT INTO users(email, hashed_password)
            VALUES ($1, $2)
            ON CONFLICT (email) DO NOTHING
            RETURNING email, id, role, created, toke_version;
            `, [email, hashed_password]); // add back created after test

         if(!user) throw errorCreator("Email already exists", "DUPE_EMAIL", 409)

         return user
    
};

export async function logIn({email, hashed_password}){
    try{
        const {rows:[user]} = await pool.query(`
            SELECT(id, role, toke_version, username) 
            FROM users
            WHERE users.email=$1 AND users.hashed_password=$2;
            `, [email, hashed_password]);

            return user
    } catch(e){
        throw e
    }
}

export async function updatePassword({hashed_password, id}, db = pool){
   try{ const {rows:[user]} = await db.query(`
        UPDATE users
        SET 
        hashed_password= $1, 
        toke_version = toke_version + 1
        WHERE id= $2
        RETURNING id, role, toke_version;
        `, [hashed_password, id])

        return user
   } catch(e){
     throw e
   }
};

export async function getPasswordByUserId(id, db = pool){
   try{ 
    const {rows:[{hashed_password}]} = await db.query(`
        SELECT hashed_password FROM users
        WHERE id = $1;
        `,[id]);

      if(!hashed_password) throw errorCreator("Unable to find user", "INVALID_ID", 404)

        return hashed_password
   } catch(e){
      e.message = "Unable to locate user with provided id"
      e.status = 400
      
      throw e
   }
};

export async function getUserByEmail(email, db = pool){

   try{
     const {rows:[user]} = await db.query(`
        SELECT id, toke_version, role, is_locked, is_active, username
        FROM users
        WHERE email = $1;
        `,[email]);

        if(!user) throw errorCreator("Unable to retrieve user", "INVALID_EMAIL", 404)

        return user;

     } catch(e){
        throw e
     }
};

export async function getUserById(id, db = pool){

      if(!Number.isInteger(id)) throw errorCreator("Invalid id", "INVALID_ID", 400);

      const {rows:[user]} = await db.query(`
        SELECT *
        FROM users
        WHERE id = $1;
        `,[id]);

      if(!user) throw errorCreator("User doesnt exists", "INVALID_ID", 404)

      delete user.hashed_password

        return user 
 
};
// add created back later into the queries get user
export async function createUsername({id, username}, db = pool){
   try{
      const {rows:[user]} = await db.query(`
         UPDATE users
         SET username = $1
         WHERE id = $2
         RETURNING id, username, toke_version, role;
         `, [username, id])

         if(!user) throw errorCreator("User doesnt exists", "INVALID_ID", 404)

         return user.username

   } catch(e){
      
      throw errorCreator("Username already exist", "INVALID_ATTEMPT", 409)
   }
}

export async function updateUserStatus(userid, status,  db = pool){


    const {rows:[user]} = await db.query(`
       UPDATE users
       SET is_active = $2, toke_version = toke_version + 1
       WHERE id = $1
       RETURNING *
        `, [userid, status]);

    if(!user) throw errorCreator("Invalid user id", "INVALID_ID", 400)

        return user
};

export async function deleteUser(userid, db = pool){
    const {rows:[user]} = await db.query(`
      DELETE FROM users
      WHERE id = $1
      RETURNING *
        `, [userid]);

      if(!user) throw errorCreator('User doesnt exist', "NOT_FOUND", 404)

      return user

}

export async function updateUserRoleAdmin(userid, updateRole, db = pool){


   const {rows: [updatedUser]} = await db.query(`
      UPDATE users
      SET role = $2
      WHERE id = $1
      RETURNING *;
      `, [userid, updateRole]);

      if(!updatedUser) throw errorCreator("Unable to update user", "INVALID_ID", 404)

      return updatedUser
}

export async function updateUserStatusAdmin(userid, status, db = pool){

   const {rows:[user]} = await db.query(`
         UPDATE users
         SET is_locked = $2, toke_version = toke_version + 1
         WHERE id = $1
         RETURNING *;
         `, [userid, status]);

         return user
};

export async function getAllUsersAdmin(id, role, db = pool){
   try{
      const check = ['admin', 'user'].includes(role.toLowerCase())

      if(!check) throw errorCreator(`The role doesn t exist`, "INVALID_INPUT", 400)
   
      const selectString =  role === 'admin' ? 'id, username, email, role, is_active, is_locked, created, toke_version' : 'id, username, role';

      const {rows} = await db.query(`
         SELECT ${selectString}
         FROM users u
         WHERE u.id != $1;
         `, [id])

      return rows
   } catch(e){
      throw e
   }
};


// create token update query and add to routes
