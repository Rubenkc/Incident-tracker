import authContext from "../contexts/AuthContext";
import { useState, useEffect} from "react";
import { useNavigate } from "react-router";


export default function Auth({children}){
    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    const [check, setCheck] = useState('checking')
    const navigate = useNavigate()
    

    useEffect(() => {
        if(localStorage.getItem('token')){
            setCheck('authorize')
            setToken(localStorage.getItem('token'))
            setUser(JSON.parse(localStorage.getItem('user')))
        } else {
            setCheck('unauthorized')
        }

        console.log('storgae token ', localStorage.getItem('token'))
        console.log('storage user', localStorage.getItem('user'))
    }, [])
    
     

  

    async function logIn(currentUser, url){
        try{
        
            const res = await fetch(`${url}/auth/users/signin`, {
                method:'POST',
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    password:currentUser.password,
                    email:currentUser.email
                })
            });

            const result = await res.json()
            console.log('login result', result)
            
            if(result?.token){

                localStorage.setItem('token', result.token)
                localStorage.setItem('user', JSON.stringify(result.user))
                setToken(result.token)
                setUser(result.user)
                setCheck('authorize')
                console.log('storgae token ', localStorage.getItem('token'))
        console.log('storage user', localStorage.getItem('user'))
            }

            return result 
 
        } catch(e){
            console.error(e)
        }
    };

    function logOut(){
        if(localStorage.getItem('token')){
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        } 
        setCheck('unauthorized')
        navigate('/')
        setUser(null)
        setToken(null)
    }

        const value = {logIn, logOut, token, setToken, user, setUser, check, setCheck}

    return(
        <authContext.Provider value={value}>
            {children}
        </authContext.Provider>
    )

}