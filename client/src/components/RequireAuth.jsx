import { Outlet, Navigate} from "react-router";
import useAuth from "../hooks/useAuth";

export default function RequireAuth(){
    const { user, check } = useAuth();

    console.log('auth check user read', user)

     if(check === 'unauthorized'){
        return <Navigate to='/' />
     } 

    return  check === 'authorize' && <Outlet /> 
}