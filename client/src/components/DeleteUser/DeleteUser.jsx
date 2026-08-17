import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";
import { useState } from "react";
import { Error } from '../index.js'
import './DeleteUser.css'
import '../Login/Login.css'

export default function DeleteUser(){
       const { token } = useAuth();
       let url = import.meta.env.VITE_API_URL;

       const [password, setPassword] = useState('');
       const [err, setErr] = useState(null);
       const [isLoading, setIsLoading] = useState(false);
       const [show, setShow] = useState(false)


       function handleChange(e){
            setPassword(e.target.value)
       }

       async function handleDelete(e){
          e.preventDefault()
          setIsLoading(true)
          setErr(null)

          try{
            let res = await fetch(`${url}/api/me/user`, {
                method:'DELETE',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body:JSON.stringify({
                    password
                })
            });

            let result = await res.json()

            if(result?.user){
                setPassword('')
                navigate('/', {state: {message: 'Successfully deleted user'}, replace: true})
            } else setErr(result.err)

          } catch(e){
            setErr(e)
          }finally{
            setIsLoading(false)
          }

       }
       

       return(
        <main className="DeletePage">
            <div className="DeleteCard">
                <h3>Delete Account</h3>
                <p>This will delete the account and all associated data. This action cannot be undone.</p>
                <form onSubmit={handleDelete} className="DeleteForm">

                    <div>
                        <label htmlFor="password">Enter password:</label>
                        <input 
                            value={password}
                            onChange={handleChange}
                            name="password"
                            id="password"
                            placeholder="Enter current password"
                            type={show ? 'text' : 'password'}
                            className="LogInp DeleteInp"
                        />
                    </div>

                    <div className="LogCheckbox">
                        <input
                        type="checkbox"
                        checked={show}
                        onChange={() => setShow(prev => !prev)}
                        id="show"
                        />
                         <label htmlFor="show">Show Password</label>
                    </div>

                    <div className="DeleteButtonSec">
                        <Link to='/reports' className="DeleteLink">Cancel</Link>
                        <button disabled={isLoading}>{isLoading ? 'Deleting...' : 'Delete Account'}</button>
                    </div>
                   
                </form>
                
            </div>
            

            
            {err && <Error message={err.message}/>}
        </main>
       )
}