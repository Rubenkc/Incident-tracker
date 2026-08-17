import { Link, Navigate } from "react-router";
import './Home.css'


export default function Home(){


    return (
        <main className="HomeContain">
            <h1>Welcome to TourSafe </h1>
            <span className="HomeDesc">A Chicago-based neighborhood incident tracker</span>
            <div className="HomeMenu">
                <Link to='/login'className="HomeButton">Log in</Link>
                <Link to='/createuser'className="HomeButton">Register</Link>
            </div>
        </main>
    )
}