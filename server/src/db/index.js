import { Pool } from 'pg';
import "dotenv/config";



const pool = new Pool(
    process.env.CONNECTION_STRING ? {
        connectionString: process.env.CONNECTION_STRING,
        ssl: { rejectUnauthorized: false },
        max: 10
    } : 
    {
        host:"localhost",
        port: 5432,
        database:"mini-project1",
}
);

export default pool;