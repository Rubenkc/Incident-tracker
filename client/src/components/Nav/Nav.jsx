import useAuth from "../../hooks/useAuth"
import { useNavigate, Link, Outlet } from 'react-router'
import { useState } from 'react'
import './Nav.css'



export default function Nav(){
    const [show, setShow] = useState(false)
    const {logOut, user} = useAuth();

    return (
      <main className="NavContainer">
        <nav className="NavBar">
            <h1 className="NavTitle">TourSafe</h1>
            <ul className="Navitems">
                <li className="NavLinks">
                  <Link to='/reports'>My Reports</Link>
                </li>
                <li className="NavLinks">
                  <Link to='/viewreports'>Active Reports</Link>
                </li>
                <li className="NavLinks">
                  <Link to='/createreport'>New Report</Link>
                </li>
                <li className='NavLinks'>
                  <Link to='/map'>Map</Link>
                </li>
              </ul>
              <div className="Dropdowncontainer">
                  <button onClick={() => setShow(prev => !prev)} className="DropdownButton">{user.username ? user.username : 'Account'} {show ? '▴' : '▾' }</button>

                  { show && <ul className="NavDropdown">
                    <li>
                      <Link to='/resetpassword'>Reset Password</Link>
                    </li>

                    <li>
                      <Link to='/delete'>Delete User</Link>
                    </li>

                    <li>
                      <Link to='/username'>Edit Username</Link>
                    </li>

                    <li className="DropLinks">
                      <Link to='/reports'>My Reports</Link>
                    </li>

                    <li className="DropLinks">
                      <Link to='/viewreports'>Active Reports</Link>
                    </li>

                    <li className="DropLinks">
                      <Link to='/createreport'>New Report</Link>
                    </li>

                    <li>
                      <button onClick={logOut} className="LogoutButton">Sign Out</button>
                    </li>
                    

                  </ul> }
                </div>


        </nav>

        <Outlet />
      </main>
    )
}