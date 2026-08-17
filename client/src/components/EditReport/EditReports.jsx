import { useState, useId } from 'react';
import { useParams, useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth.js';
import { Error } from '../index.js'
import '../CreateReport/CreateReport.css'

export default function EditReport(){
    const [form, setForm] = useState({report:'', address:''});
    const [err, setErr] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    let baseId = useId();
    let params = useParams();
    let navigate = useNavigate()

    

    const url = import.meta.env.VITE_API_URL
    const {token} = useAuth()

    function handleChange(e){
        const {name, value } = e.target;

        setForm(prev => (
            {...prev , [name]: value}
        ))

        console.log('form', form)
    };

    async function handleSubmit(e){
        e.preventDefault()
        setIsLoading(true)

        try{
            const res = await fetch(`${url}/api/report/${params.id}`, {
                method:"PATCH",
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            
            const result = await res.json();

            console.log('edited report', result)

            if(result.result){
                setForm({report:'', address:''})
                navigate('/reports', {state: {success:true}, replace: true})
            } else setErr(result.err)
            
        } catch(e){
            setErr(e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className='CReportPage'>
            
            <h1 className='CRTitle'>Edit Report</h1>
            <form onSubmit={handleSubmit} className='ReportForm'>

                <div>
                    <label htmlFor={`${baseId}/report`} className='CRLabel'>Report</label>
                    <textarea
                        id={`${baseId}/report`}
                        name='report'
                        value={form.report}
                        onChange={handleChange}
                        className='ReportText ReportInp'
                        maxLength={240}
                        required
                    />
                    <h1 className='ReportLength'>{form.report.length}/240</h1>
                </div>

                <div>
                    <label htmlFor={`${baseId}/address`} className='CRLabel'>address</label>
                    <input
                        id={`${baseId}/address`}
                        name='address'
                        value={form.address}
                        onChange={handleChange}
                        type='text'
                        className='ReportLocation ReportInp'
                        required
                    />
                </div>

                <button disabled={isLoading} className='CRButton'>{isLoading ? 'Saving...' : 'Save Changes'}</button>
            </form>
            {err && <Error message={err.message} />}
            {isLoading && <h3>Loading... </h3>}
        </main>
    )
}