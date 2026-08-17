import dotenv from "dotenv";

dotenv.config({
  path: "../../.env" // adjust based on where you run from
});

 const { default: pool } = await import("./index.js")





async function NeighFetch(db = pool){

    try{
        const res = await fetch('https://data.cityofchicago.org/resource/y6yq-dbs2.json');
        const result = await res.json();

        console.log(result)

        for (const neighborhood of result ){

            await db.query(`
            INSERT INTO neighborhoods( name, type, coords)
            VALUES ($1, $2, $3)
            `, [neighborhood.pri_neigh, neighborhood.the_geom.type, JSON.stringify(neighborhood.the_geom.coordinates) ])
        } 

    } catch(e) {
        throw e
    }
}

NeighFetch()


