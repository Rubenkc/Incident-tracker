import { useState, useId } from 'react'
import useAuth from '../../hooks/useAuth';
import { useNavigate, Link, useLocation } from 'react-router';
import { Error } from '../index.js'
import './Login.css'


const url = import.meta.env.VITE_API_URL;


export default function Login(){
    const {logIn} = useAuth()
    const navigate = useNavigate();
    const [form, setForm] = useState({ email:'', password:'' });
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState(null)
    const id = useId();
    const { state } = useLocation()

function onChange(e){
    let {value, name} = e.target
    setForm((prev) => {
        return {...prev, [name]: value}
    } )
}

async function handleSubmit(e){

    setIsLoading(true)
    setErr(null)

    try{
        e.preventDefault()
        let result = await logIn(form, url);
        console.log("successful log in", result)

        setForm({ email:'', password:''});

        if(result?.err) setErr(result.err)
        
        result.user.role === 'user' ? navigate('/reports') : navigate('/admin') // figure out how to nvigate from here, it would be redundant if we check here and then in the route

    } catch(e){
        setErr(e)
    } finally {
        setIsLoading(false)
    }
}

    

    return (
        <main className='LogHome'>
            <div className='LogCard'>
                {state?.message && <h3>{state.message}</h3>}
                <form onSubmit={handleSubmit} className='LogForm'>
                    <h1 className='LogTitle'>Log in</h1>

                    <div className='LogGroup'>
                        <label htmlFor={`${id}/email`} className='LogLab' >Email: </label>
                        <input 
                        name='email'
                        type='email'
                        placeholder='email'
                        value={form.email}
                        onChange={onChange}
                        id={`${id}/email`}
                        className='LogInp'
                        required
                        />
                    </div>
                
                    <div>
                        <label htmlFor={`${id}/pass`} className='LogLab'>Password: </label>
                        <input 
                        name='password'
                        type={show ? 'text' : 'password'}
                        placeholder='password'
                        value={form.password}
                        onChange={onChange}
                        id={`${id}/pass`}
                        className='LogInp'
                        required
                        />
                    </div>

                    <div className='LogCheckbox'>
                        <input 
                        name='checkbox'
                        type='checkbox'
                        checked={show}
                        onChange={() => setShow(prev => !prev)}
                        id={`${id}/show`}
                        />
                        <label htmlFor={`${id}/show`} >Show password </label>
                    </div>
                    <button  disabled={isLoading} className='LogButton'>{isLoading ? 'Logging in...' : 'Log in'}</button>
                </form>
                
                <Link to='/createuser' className='LogLink'>Not a member? Join now!</Link>

                {err && <Error message={err.message} /> }
            </div>
        </main>
    )
}

