import { useState, useId } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router';
import { Error } from '../index.js'
import '../Login/Login.css'
import './ResetPassword.css'

export default function ResetPassword(){
    const [form, setForm] = useState({ password:'', newPassword:'' });
    const [isUpdating, setIsUpdating] = useState(false);
    const [err, setErr] = useState(null);
    const [show, setShow] = useState(false)
    const { token } = useAuth();
    const id = useId();
    const url = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    

    async function handleSubmit(e){

        setIsUpdating(true);
        setErr(null)
        e.preventDefault()

        try{
            let res = await fetch(`${url}/api/me/password`, {
                method:'PATCH',
                headers:{
                    'Content-Type':`application/json`,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            })
            let result = await res.json();

            if(result?.message){
                navigate('/login')
                setForm({password:'', newPassword:''})
            } else setErr(result.err)

        } catch(e){
            setErr(e)
        } finally{
            setIsUpdating(false)
        }
    } 

    function handleChange(e){
        const {value, name} = e.target
        setForm(prev => (
            {...prev, [name] : value})
        )
    };

    return(
        <main className='LogHome'>
            <h1 className='LogTitle'>Reset Password</h1>
            
            <div className='LogCard'>
                <form onSubmit={handleSubmit} className='LogForm ResetForm'>
            
                    <div>
                        <label htmlFor={`${id}-password`}>Current Password:</label>
                        <input 
                            placeholder='password'
                            name='password'
                            value={form.password}
                            onChange={handleChange}
                            id={`${id}-password`}
                            type={show ? 'text' : 'password'}
                            className='LogInp'
                        />
                    </div>
                    <div>
                        <label htmlFor={`${id}-newPassword`}>New Password:</label>
                        <input 
                            placeholder='new password'
                            name='newPassword'
                            value={form.newPassword}
                            onChange={handleChange}
                            id={`${id}-newPassword`}
                            type={show ? 'text' : 'password'}
                            className='LogInp'
                        />
                    </div>

                    <div className='LogCheckbox'>
                        
                        <input
                        type='checkbox'
                        checked={show}
                        onChange={() => setShow(prev => !prev)}
                        id={`${id}/show`}
                        />
                        <label htmlFor={`${id}/show`}>Show password</label>
                    </div>
                    

                    <button disabled={isUpdating} className='LogButton'>{isUpdating ? 'Updating...' : 'Update Password'}</button>
                </form>
            </div>
            
            {err && <Error message={err.message}/>}
        </main>
    )
}
