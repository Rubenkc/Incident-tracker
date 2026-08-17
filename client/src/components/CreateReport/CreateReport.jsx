import { useState } from 'react'
import useAuth from '../../hooks/useAuth.js';
import { Error } from '../index.js'
import './CreateReport.css'

export default function CreateReport(){
    const [creating, setCreating] = useState(false);
    const [err, setErr] = useState(null)
    const [report, setReport] = useState({report:'', address:''});
    const api = import.meta.env.VITE_API_URL;

    const {token} = useAuth();

    function onChange(e){
        const {name, value} = e.target

        setReport((prev) => (
            {...prev, [name] : value}
        ))
    };

    async function handleSubmit(e){
        e.preventDefault()
        setCreating(true)
        try{
            const res = await fetch(`${api}/api/report/create`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                report:report.report,
                address:report.address
            })
            })

            setReport({ report:'', address:''})

            const result = await res.json()

            console.log('Creating report', result)

            return result
        } catch(e){
            setErr(e)
        } finally{
            setCreating(false)
        }
    }

    return (
        <main className='CReportPage'>
            <h1 className='CRTitle'>Create Report</h1>
            <form onSubmit={handleSubmit} className='ReportForm'>
                
                <div className='InpCard'>

                    <label htmlFor='report-report' className='CRLabel'>Report </label>

                        <textarea 
                        name='report'
                        value={report.report}
                        type='text'
                        onChange={onChange}
                        placeholder='I witnessed....'
                        id='report-report'
                        className='ReportText ReportInp'
                        maxLength={240}
                        required
                        />
                        <h1 className='ReportLength'>{report.report.length}/240</h1>
      
                </div>

                <div className='InpCard'>
                    <label htmlFor='report-address' className='CRLabel'>Address </label>
        
                    <input 
                    name='address'
                    type='address'
                    value={report.address}
                    onChange={onChange}
                    placeholder='ex. St Louis & Wabansia'
                    id='report-address'
                    className='ReportLocation ReportInp AddressInp'
                    required
                    />
                
                </div>
                

                <button disabled={creating} className='CRButton'>{creating ? 'Creating...' : 'Create Report'}</button>
            </form>

            <span>{err && <Error message={err.message}/>}</span>
        </main>
    )
}