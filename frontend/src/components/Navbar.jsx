import { Person, Search, Menu } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import React, { useState } from 'react'
import variables from '../styles/variables.scss'
import { useDispatch, useSelector } from 'react-redux'
import '../styles/Navbar.scss'
import { Link, useNavigate } from 'react-router-dom'
import { setLogout } from '../redux/state'
const Navbar = () => {
    const user = useSelector(state => state.user.user)
    const [dropdownMenu, setDropdownMenu] = useState(false);
    const dispatch = useDispatch()
    const [search, setSearch] = useState("")
    const navigate = useNavigate()

  return (
    <div className='navbar'>
        <a href="/">
            <img src="https://i.ibb.co/3SQx5SP/logo.png" alt="" />
        </a>
        <div className="navbar_search">
            <input type="text" placeholder="Search for homes..." value={search}
                   onChange={(e) => setSearch(e.target.value)} />
            <IconButton disabled={search === ""} onClick={() => {navigate(`/properties/search/${search}`)}}> 
                <Search sx={{color: variables.pinkred}} /> 
            </IconButton>
        </div>
        <div className="navbar_right">
            {user ? (
                <a href="/create-listening" className="host">Become a Host</a>
            ) : (
                <a href="/login" className="host">Become a Host</a>
            )}
            <button className="navbar_right_account" onClick={() => setDropdownMenu(!dropdownMenu)}>
                <Menu sx={{color: variables.darkgrey}}/>
                {!user ? (
                    <Person sx={{color: variables.darkgrey}}/>
                ) : (
                    <img src={user.profileImage} alt="profile image"/>                     
                )}
            </button>
            {dropdownMenu && !user && (
            <div className="navbar_right_accountmenu">
                <Link to="/login">Log In</Link>
                <Link to="/register">Sign Up</Link>
            </div>
            )}
            {dropdownMenu && user && (
            <div className="navbar_right_accountmenu">
                <Link to={`/${user._id}/trips`}>Trip List</Link>
                <Link to={`/${user._id}/wishList`}>Wish List</Link>
                <Link to={`/${user._id}/properties`}>Property List</Link>
                <Link to={`/${user._id}/reservations`}>Reservation List</Link>
                <Link to="/create-listening">Become A Host</Link>

                <Link to="/login" onClick={() => { dispatch(setLogout());}}>
                Log Out
                </Link>
            </div>
            )}
        </div>
    </div>
  )
}

export default Navbar