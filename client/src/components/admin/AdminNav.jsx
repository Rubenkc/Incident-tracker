import useAuth from "../../hooks/useAuth";
import { Outlet, Link } from "react-router";
import { useState } from 'react'
import '../Nav/Nav.css'
import './AdminNav.css'

export default function AdminNav(){
    const [show, setShow] = useState(false)
    const {logOut} = useAuth();

    return (
        <main className="NavContainer">
            <nav className="NavBar">
                <h1 className="NavTitle">Admin</h1>

                <ul className="Navitems Adminitems">
                        <li>
                            <Link to='/pending'>Pending</Link>
                        </li>
                        <li>
                            <Link to='/users'>Users</Link>
                        </li>
                        <li>
                            <button onClick={logOut} className="AdminLogout">Log Out</button>
                        </li>
                     </ul>

                <div className="DropdownAdmin">
                    <button onClick={() => setShow(!show)} className="DropdownButton" >Admin {show ? '▴' : '▾' }</button>

                    { show && 
                     <ul className="NavDropdown">
                        <li className="DropLinks">
                            <Link to='/pending'>Pending</Link>
                        </li>
                        <li className="DropLinks">
                            <Link to='/users'>Users</Link>
                        </li>
                        <li>
                            <button onClick={logOut} className="LogoutButton">Log Out</button>
                        </li>
                     </ul>
                    }
                </div>
            </nav>

            <Outlet />
        </main>
    )
}