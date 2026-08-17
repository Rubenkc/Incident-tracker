import useAuth from "../../hooks/useAuth"
import { useState } from 'react'
import { Error } from '../index.js'
import { useNavigate } from "react-router"
import './Report.css'

const url = import.meta.env.VITE_API_URL

export default function Report({report, reports, handleDelete, setReports}){
    let [value, setValue] = useState('approved');
    let [isLoading, setIsLoading] = useState(false);
    let [err, setErr] = useState(null)
    const { token, user } = useAuth();
    const navigate = useNavigate()

    

    console.log("the value", value)

   

    async function handleSubmit(e){
        e.preventDefault()
        setIsLoading(true)
        try{
            const res = await fetch(`${url}/api/admin/report/status/${report.id}`, {
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                },
                body:JSON.stringify({
                    status:value
                })
            });

            const result = await res.json()

            console.log('The new edited report', result)

            

            if(result.result) setReports(rep => rep.filter(r => r.id !== result.result.id));
            else setErr(result.err)
            

        } catch(e){
           setErr(e)
        } finally {
            setIsLoading(false)
        }
    };

    const date = new Date(report.created);


    return(
        <main className="ReportCard">
            <h2 className="CardUsername">{user.username}</h2>
            <p>{report.report}</p>
            
            <div className="ReportDetails">
                <h5>Status: {report.status}</h5>
                <h5>Address: {report.address}</h5>
                <h5>{date.toLocaleDateString("en-US", {
                    timeZone:'America/Chicago',
                    hour:"numeric",
                    minute:"2-digit"

                })}</h5>
            </div>
            {(report.status === 'pending' && user.role !== 'admin') && <button onClick={() => navigate(`/edit/${report.id}`)}>Edit</button>}
            <div className="SpecialButtonSec">
                {(user.role === 'admin' && report.status === 'pending') &&
                <form onSubmit={handleSubmit} className="AdminSec">

                    <select onChange={(e) => setValue(e.target.value)}>
                        <option>approved</option>
                        <option>declined</option>
                    </select>

                    <button disabled={isLoading}>{isLoading ? "Updating..." : "Update" }</button>
                </form>
                }
                {(report.status !== 'pending' || user.role === 'admin') &&
                 <button type="button" disabled={isLoading} onClick={(e) => handleDelete(e, report.id)} className="DeleteButton">Delete</button>}
            </div>
            
            {err && <Error message={err.message} />}
        </main>
    )
}