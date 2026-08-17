import { insertCrimes, fetchInfo, insertOffset } from "../queries/crimes";
import pool from "../index.js";

 

export default async function crimeFetch(){
    let currentDate = new Date();
    let lastYear = new Date(currentDate);
    let loop = true;
    const limit = 1000;
   

    try{
        lastYear.setFullYear(lastYear.getFullYear() - 1)

        let year = lastYear.getFullYear();
        let month = String(lastYear.getMonth() + 1);
        let day = String(lastYear.getDate());
        let time = lastYear.toTimeString().substring(0,8);
        let millisec = '00' + String(lastYear.getMilliseconds())

        let dateString = `${year}-${month.length > 1 ? month : '0' + month}-${day.length > 1 ? day : '0' + day}T${time}.${millisec.substring(millisec.length - 3)}` // padStart method does the same thing
        
        
        while(loop){ // do.. while loop revision tomorrow
            const { current_offset } = await fetchInfo();
            const res = await fetch(`https://data.cityofchicago.org/resource/f6bk-yv3r.json?$limit=${limit}&$offset=${current_offset}&$where=date> '${dateString}'&$order=id ASC`);
            const rows = await res.json();
            const client = await pool.connect();
            

            if(rows.length === 0){
                await insertOffset(0, true)
                client.release();
                break;

            } else if ( rows.length < limit){
                loop = false;
            }

            

            try{
                
                await client.query(`BEGIN`);

                for(let i = 0; i < rows.length; i += 100){
                    let batch = rows.slice(i, i + 100);

                    await insertCrimes(batch, client);
                }

                await insertOffset(loop ? current_offset + limit : 0, true, client);

                await client.query('COMMIT')

                
            
                                
            } catch(e){
                await client.query('ROLLBACK');
                throw e

            } finally{
                
                client.release();
            }

        }
            
            
            
           

            
    } catch(e) {
        throw e;
    }  
}