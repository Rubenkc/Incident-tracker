import pool from '../index.js'

export async function fetchInfo(){
    try{
        const {rows} = await pool.query(`
            SELECT * FROM fetch_info;
            `)

            return rows 
    } catch (e) {
        console.log(e)
    }
};

export async function insertOffset(offset, boolean){
    try{
        await db.query(`
            INSERT INTO fetch_info(current_offset, fetch_success)
            VALUES ($1, $2)
            WHERE city = 'chicago'
            `, [offset, boolean])
    } catch (e){
        console.log(e)
    }
}

export async function insertCrimes(fetchArr, db = pool){

    let valueArray= [];
    let offset = 1;
    let string = fetchArr.map((crimeObj, i) => {
        

        const schema = Object.keys(crimeObj);
        let current = i * (schema.length + offset) + 1; // +1 for for the indexing since it starts at 0
        let stringInter = '';
        


        schema.forEach((key, index) => {
            const comma = index === 0 ? '' : ', ';
            if(key === 'location') {
                valueArray.push(crimeObj[key]['coordinates'][0], crimeObj[key]['coordinates'][1])
               stringInter += comma + `ST_SetSRID(ST_POINT($${index + current}, $${index + current + 1}), 4326))`
                current++
            } else{
                valueArray.push(crimeObj[key])
                stringInter += comma + `$${index + current}`
            }  
                
        })



        return `(${stringInter})`;
    }).join(', ');

    try{
      await db.query(`
        INSERT INTO crimes(${Object.keys(fetchArr[0]).join(', ')})
        VALUES ${string}
        `, valueArray)
    } catch(e){
        console.log(e)
    }
};

export async function  deleteCrimes(){
    try{
        await pool.query(`
            DELETE FROM crimes
            WHERE date < (NOW() AT THE TIME ZONE 'America/Chicago') - interval '1 year'
            `);
    } catch(e){
        console.log(e)
    }
}