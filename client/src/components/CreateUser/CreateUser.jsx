import { useNavigate, Link} from "react-router";
import { useState, useId } from "react";
import useAuth from "../../hooks/useAuth";
import { Error } from '../index.js'
import './CreateUser.css'



export default function CreateUser(){
    const url = import.meta.env.VITE_API_URL;
    const baseId = useId()
    const [form, setForm] = useState({
        email:'',
        password:'',
        confirmPassword:''
    });
    const [err, setErr] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false)

    const navigate = useNavigate()
    const {setToken, setUser, setCheck } = useAuth()

    function onChange(e){
        const {value, name} = e.target

        console.log(form.password)

        setForm(prev => ({...prev, [name]:value}))
    }

    async function handleSubmit(e){
        e.preventDefault();
        setErr(null);
        

        if(form.password !== form.confirmPassword){
            setErr({message:'Passwords dont match'})
            setForm (prev => ({...prev, confirmPassword:'', password:''}))
            return;
        }
        try{
            setIsLoading(true)

            const res = await fetch(`${url}/auth/users/`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                email:form.email,
                password:form.password
            })
            });

            const result = await res.json()

            if(result.token){
                localStorage.setItem('token', result.token)
                localStorage.setItem('user', JSON.stringify(result.user))
                setToken(result.token)
                setCheck('authorize')
                setUser(result.user)
                setForm({email:'', password:'', confirmPassword:''})
                
                navigate('/reports')

            } else setErr(result.err);

        } catch (e){
            setErr(e)
        } finally {
            setIsLoading(false)
        }

        

    }

    return(
        <main className="NUPage">
            <div className="NUCard">
                
                <form onSubmit={handleSubmit} className="NUForm">
                    <h1 className="NUtitle">Create an account</h1>
                    <div>
                        <label htmlFor={`${baseId}-email`} className="NUlabel">Email:</label>
                        <input
                        id={`${baseId}-email`}
                        name="email"
                        value={form.email}
                        type="email"
                        onChange={onChange}
                        placeholder="example@gmail.com"
                        className="NUInp"
                        />

                    </div>
                    
                    <div>
                        <label htmlFor={`${baseId}-password`} className="NUlabel">Password:</label>
                        <input 
                        id={`${baseId}-password`}
                        name="password"
                        value={form.password}
                        placeholder="password"
                        type={show ? 'text' : "password"}
                        onChange={onChange}
                        className="NUInp"
                        />
                    </div>
                                
                    <div>
                        <label htmlFor={`${baseId}-check`} className="NUlabel">Confirm password</label>
                        <input 
                        id={`${baseId}-check`}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        placeholder="confirm password"
                        type={show ? 'text' : "password"}
                        onChange={onChange}
                        className="NUInp"
                        />
                    { (form.confirmPassword && form.password !== form.confirmPassword) && <h5>Password must match</h5> }
                    </div>
                    
                    <div className='NUcheck'>
                        <input 
                        name="show"
                        type="checkbox"
                        onChange={() => setShow(prev => !prev)}
                        checked={show}
                        id={`${baseId}-show`}
                        />
                        <label htmlFor={`${baseId}-show`} >Show Password</label>
                    </div>
                    

                <button disabled={isLoading} className="NUbutton">{isLoading ? "Creating..." : "Create Account"}</button>

                </form>
                {err && <Error message={err.message} />}
                <Link to='/' className="NUlink">Return to Home</Link>
            </div>
            
        </main>
    )
    
}