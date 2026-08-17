import useAuth from "../hooks/useAuth"


export default function Activate(){
    const {logOut} = useAuth();
 

   

    return (
        <main>
            <h1>User reactivation page</h1>
            <span>Your acoount has been deactivated, contact support for help or if you have questions</span>
            
            <div>
                <button onClick={logOut}>Log Out</button>
            </div>
        </main>
    )
}