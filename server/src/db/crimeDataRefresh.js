import pool from "./index.js";
import { fetchInfo, deleteCrimes } from './queries/crimes.js'



export async function fetchCrimeData(){
    let fetch = true;
    let second = 1000;
    let minute = 60;
    let hour = 60;
    let day = 24;

    
    try{

        const fetchData = await fetchInfo();
        let milliDate = new Date(fetchData.last_fetched)

        if( Date.now() > milliDate.getTime() + (second * minute * hour * day)){ // utc time have to convert to central

            while(fetch){
                

                const result = await fetch(`https://data.cityofchicago.org/resource/f6bk-yv3r.json?limit=1000&offset=0`)
            }     
        }
        
        await deleteCrimes();
        
    } catch (e){
        
    }
}