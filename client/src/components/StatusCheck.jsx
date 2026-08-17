import { Outlet, Navigate } from "react-router";

import useAuth from "../hooks/useAuth";

export default function ActiveCheck(){
    const {user} = useAuth();

    return user?.is_locked ? <Navigate to='/activate'/> : <Outlet />
}