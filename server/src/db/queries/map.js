import pool from '../index.js';


 export async function getNeigh(db = pool){
    try{
        const {rows} = await db.query(`
            SELECT * FROM neighborhoods;
            `)

            return rows

    } catch(e){
        console.log(e)
    }
};

