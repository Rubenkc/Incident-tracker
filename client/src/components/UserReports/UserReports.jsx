import { useState, useEffect } from 'react';
import  useAuth  from '../../hooks/useAuth.js';
import { Report } from '../index.js';
import { useLocation } from 'react-router';
import './UserReport.css'

//reuest inst working found several bugs in the untested query. param potentially reading as a  string and not a num? we can check after we test query 
const url = import.meta.env.VITE_API_URL;

export default function UserReports(){
    let [reports, setReports] = useState(null);
    let [showMessage, setShowMessage] = useState(false);
    let [activeTab, setActiveTab] = useState('All')
    let [err, setErr] = useState(null);
    let [isLoading, setIsLoading] = useState(false);
    let count = {
        all: reports?.length ?? 0,
        approved:0,
        declined:0,
        pending:0
    }

    const { state } = useLocation();
    const { user, token } = useAuth();

    async function handleDelete(e, id){
        e.preventDefault()
        setErr(null)
        try{
           const res = await fetch(`${url}/api/report/${id}`, {
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                }  
            });

            const result = await res.json()
            
            if(result.result){
                setReports(prev => prev.filter(rep => rep.id !== result.result.id))
            } else setErr(result.err)
           

        } catch(e){
            setErr(e)
        }
    };

    useEffect(() => {
        async function getReports(){
            setIsLoading(true)
            setErr(null)
            try{
                const res = await fetch(`${url}/api/report/${user.id}`, {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await res.json()

                if(result?.err){
                    setErr(err)
                } else setReports(result)

            } catch(e){
                setErr(e)
            } finally {
                setIsLoading(false)
            }
        };

        getReports()

        if(state?.message){
            setShowMessage(true)
            setTimeout(() => {
                setShowMessage(false)
            }, 5000)
        };

    }, []);

    reports?.map( rep => count[rep.status] += 1)
    
    let filteredRep = activeTab === 'All' ? reports : reports.filter(rep => rep.status === activeTab)

    console.log('active tab', activeTab)

    return (
        <main className='HomeLayout'>
            {showMessage && <h1>{state?.message}</h1>}
            <div className='HomeTabs'>
                <button onClick={() => setActiveTab('All')}>{`All(${count.all})`}</button>
                <button onClick={() => setActiveTab('approved')}>{`Approved(${count.approved})`}</button>
                <button onClick={() => setActiveTab('declined')}>{`Declined(${count.declined})`}</button>
                <button onClick={() => setActiveTab('pending')}>{`Pending(${count.pending})`}</button>
            </div>
            <div className='HomeCardContainer'>
                
                {reports && (reports.length !== 0 ? filteredRep.map(rep => (
                    
                    <div key={rep.id} className='HomeCard' >
                        <Report handleDelete={handleDelete} reports={reports} report={rep} setReports={setReports}/>
                        
                    </div>
                )) : <h1>You havent created any reports</h1>)}
                {isLoading && <h1>Loading...</h1>}
                {err && <Error message={err.message} />}
            </div>
            
        </main>
    )
}