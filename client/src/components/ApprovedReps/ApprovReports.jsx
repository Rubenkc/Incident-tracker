import { useEffect, useState } from 'react'
import { Error, ViewReport } from '../index.js'
import './ApprovRep.css'
import '../UserReports/UserReport.css'

const url = import.meta.env.VITE_API_URL;

export default function ApprovedReports(){

    const [reports, setReports] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState(null)

    async function getReports(){
        setIsLoading(true)
        try{
            let res = await fetch(`${url}/auth/reports`, {
                headers:{
                    'Content-Type': 'application/json'
                }
            });

            let result = await res.json();

            if(result.err){
                setErr(result.err)
            } else setReports(result.result)

        } catch(e){
            setErr(Result.err)
        } finally {
            setIsLoading(false)
        }
    }
    
    useEffect(() => {
        getReports()
    }, []);

    return(
        <main className='ReportPage'>
            <h1 className='ReportTitle'>User Reports</h1>
            {isLoading && <h3>Retrieving...</h3>}

            {(reports && isLoading === false) && (reports.length > 0 ? reports.map(rep => {

                const dtae 

                return (
                    <div key={rep.id} className='HomeCard'>
                        <ViewReport report={rep} />
                    </div>
                    
                )
            }) : <h1>No user reports available</h1>
            )}

            {err && <Error message={err.message}/>}
        </main>
    )
}