import React from 'react'

import '../style/NavbarLoggedOut.css'

const NavbarLoggedOut = (props) => {
    return (
        <div className="navbar-grid">
            <div className="navbar-items navbar-logo-NavBarLoggedOut">
                <h1>
                    {props.title}
                </h1>
            </div>

            <div></div>

            <div className='LoginButton-NavBarLoggedOut'>
                Log In
            </div>

            <div className='RegisterButton-NavBarLoggedOut'>
                Register
            </div>
        </div>
    )
}
export default NavbarLoggedOut;
