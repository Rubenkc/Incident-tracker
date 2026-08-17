import { useState, useEffect } from 'react'
import useAuth from '../../hooks/useAuth';
import { Report, Error } from '../index';
import '../UserReports/UserReport.css'
import '../CreateReport/CreateReport.css'




export default function PendingReports(){
    const [reports, setReports] = useState(null);
    const [isLoading, setIsloading] = useState(false);
    const [err, setErr] = useState(null);

    const url = import.meta.env.VITE_API_URL;
    const { token, user } = useAuth();

    async function handleDelete(e, id){
        e.preventDefault()
        setIsloading(true)
        try{
           const res = await fetch(`${url}/api/admin/report/${id}`, {
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                }  
            });

            const result = await res.json()
            
            if(result.result) setReports(prev => prev.filter(rep => rep.id !== result.result.id))
            else setErr(result.err)
            
        } catch(e){
            setErr(e)
        } finally {
            setIsloading(false)
        }
    }

    useEffect( () => {
        async function getReports(){
            setIsloading(true)
            try{
            const res = await fetch(`${url}/api/admin/reports/pending`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })

            const result = await res.json()

            

            if(result.result) setReports(result.result)
            else setErr(result.err)
           

            } catch(e){
                setErr(e)
            } finally {
                setIsloading(false)
            }
        }
        
        getReports()
        
    }, []); 

    return (
        <main className='AdminPage'>
            <h1 className='CRTitle'>{isLoading ? "Loading..." : 'Pending reports'}</h1>
            {(reports && !isLoading) && (reports.length === 0 ? <h1>No pending reports</h1> : reports.map(report => (
                <div key={report.id} id={report.id} className='HomeCard'>
                    <Report setReports={setReports} report={report} handleDelete={handleDelete}/>
                </div>
            )) 
            )}
            {err && <Error message={err.message}/>}

            
        </main>
    )

}