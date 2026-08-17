import useAuth from "../hooks/useAuth";
import { Navigate, Outlet} from "react-router";

export default function UserRole(){
    const {user} = useAuth();
    console.log('role', user.role)

    return (
        <>
        {user.role === 'admin' ? <Outlet /> : <Navigate to='/'/>}
        
        </>
    )
    

}