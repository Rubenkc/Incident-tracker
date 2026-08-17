import pool from './index.js'


export default async function createdb(db = pool){
    try{
        await db.query(`
            CREATE TABLE IF NOT EXISTS users(
             id SERIAL PRIMARY KEY,
             username VARCHAR(20) UNIQUE ,
             email CITEXT UNIQUE NOT NULL,
             hashed_password VARCHAR(255) NOT NULL,
             role TEXT NOT NULL DEFAULT 'user',
             is_active BOOLEAN NOT NULL DEFAULT true,
             is_locked BOOLEAN NOT NULL DEFAULT false,
             created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
             toke_version INTEGER NOT NULL DEFAULT 0
            )`)
            

        await db.query(`
            CREATE TABLE IF NOT EXISTS reports(
             id SERIAL PRIMARY KEY,
             report TEXT NOT NULL,
             address TEXT NOT NULL,
             status TEXT NOT NULL DEFAULT 'pending',
             FOREIGN KEY (user_id) INTEGER REFERENCES users(id) ON DELETE CASCADE,
             created TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )`)
    } catch(e){
        console.error(e)
    }
};

