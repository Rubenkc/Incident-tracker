import { useState } from 'react'
import { useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import { Error } from '../index.js'
import './EditUsername.css'
import '../Login/Login.css'

const url = import.meta.env.VITE_API_URL;

export default function EditUsername(){
    const [username, setUserName] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [err, setErr] = useState(null)
    const { token, user, setUser } = useAuth();
    const navigate = useNavigate()

    let storedUser = JSON.parse(localStorage.getItem('user'));

    async function handleSubmit(e){
        e.preventDefault()
        setIsUpdating(true)

        if(!storedUser){
            navigate('/login', {state: {message: 'Session expired, log in again!'}, replace: true})
            return;
        } else if (username === storedUser.username){
            setErr({message: 'Username already exist, must be unique'})
            setIsUpdating(false)
            return;
        }

        try{
            let res = await fetch(`${url}/api/me/username`, {
                method:'PATCH',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username
                })
            });

            let result = await res.json();

            if(result?.result){
                setUser(prev => (
                    {...prev, username: result.result}
                ))
                localStorage.setItem('user', JSON.stringify({...storedUser, username: result.result}))
                setUserName('')
                navigate('/reports', {state: {message:"Successfully changed username"}, replace:true })

            } else setErr(result.err)

        } catch(e){
            setErr(e)
        } finally {
            setIsUpdating(false)
        }
    }

   

    return(
        <main className='LogHome'>
            <h1 className='LogTitle'>Edit Username</h1>
            <div className='LogCard'>
                <h4>Current Username:</h4>
                <h1>{user.username ? user.username : 'No username'}</h1> 

                <form onSubmit={handleSubmit} className='LogForm'>
                <label htmlFor='edit'>New username: </label>

                    <input 
                        id='edit'
                        value={username}
                        name='edit'
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder='username'
                        className='LogInp EditInp'
                    />
                    <button disabled={isUpdating} className='LogButton EditInp'>{isUpdating ? "Updating..." : 'Update Username'}</button>
                </form>
                {err && <Error message={err.message}/>}
            </div>
            
        </main>
    )
}