import React from 'react'
import { Link } from 'react-router-dom'

import '../style/Navbar.css'
/* 
   pass 2 props to navbar component
   1. Title
   2. First Name Of User
*/
const Navbar = ({ title, first_name }) => {
    return (
        <div className="navbar-grid">
            <div className="navbar-items navbar-logo">
                <h1>
                    {title}
                </h1>
            </div>

            <div className="navbar-items navbar-search">
                <input type="text" name="search" placeholder="Search At Terrabuzz"></input>
            </div>

            <div className="navbar-items navbar-control-1">
                <Link to='/Profile'>
                    <img className="round-img" src='/assets/img/misc/UserProfilePicture.jpg' alt="" />
                </Link>
                <h3> {first_name} </h3>
            </div>

            <div className="navbar-items navbar-control-2">
                <Link to='/Settings'>
                    <img className="round-img" src='/assets/img/icon/settings.svg' alt="" />
                </Link>
            </div>

            <div className="navbar-items navbar-control-3">
                <Link to='/Notifications'>
                    <img className="round-img" src='/assets/img/icon/notificationsIcon.svg' alt="" />
                </Link>
            </div>

        </div>
    )
}
export default Navbar