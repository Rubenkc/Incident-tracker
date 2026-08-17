import { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth.js";
import { Error } from '../../index.js'
import './AdminUsers.css'

export default function ManageUsers(){
    const url = import.meta.env.VITE_API_URL
    const [isLoading, setIsLoading] = useState(false)
    const [users, setUsers] = useState(null);
    const [err, setErr] = useState(null)
    const {token, user} = useAuth()

    
    async function getUsers(){
        setIsLoading(true)

        try{
            const res = await fetch(`${url}/api/admin/users`, {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await res.json();

            console.log("users", result)

            setUsers(result.users)
        } catch(e){
            setErr(e)
        } finally { setIsLoading(false) }
    };

    async function handleDelete(e, userid){
        e.preventDefault()
        try{
            const res = await fetch(`${url}/api/admin/user/${userid}`, {
                method:'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await res.json()

            setUsers((prev) => prev.filter(user => user.id !== result.result.id))
        }catch(e){
            setErr(e)
        }
    };

    async function handleUserStatus(e, boolean, userid){
        e.preventDefault()
        try{
            const res = await fetch(`${url}/api/admin/user/status/${userid}`,{
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`,
                },
                body:JSON.stringify({
                    status: !boolean
                })
            });

            const result = await res.json();
            
            if(result.result){
                setUsers((prev) => prev.map(user => user.id === result.result.id ? result.result : user))
            } else { setErr(result.err) }
            } catch (e){
                setErr(e)
            } 
    }


    useEffect(() => {
        getUsers()
    }, [])


    return(
        <main className="tablePage">
            <h1 className="tableTitle">{isLoading ? 'Loading...' : 'Users'}</h1>
            <div className="tableCard">

                <table className="AdminTable">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Disable</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.map(user => {
                            return (
                                <tr key={user.id}>
                                    <td>{user.username ?? 'No username'}</td>
                                    <td>{user.email}</td>
                                    <td>{!user.is_locked ? 'Active' : 'Inactive'}</td>
                                    <td><button onClick={(e) => handleUserStatus(e, user.is_locked, user.id)}>{user.is_locked ? 'Enable' : 'Disable'}</button></td>
                                    <td><button onClick={(e) => handleDelete(e, user.id)}>Delete</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            {err && <Error message={err.message} />}
        </main>
    )
}