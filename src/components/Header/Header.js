import React from 'react'
import './Header.css'
import {FaHome} from "react-icons/fa";
import {Link, useNavigate} from 'react-router-dom';
import {auth} from '../../config/firebaseConfig'
import {useAuthState} from 'react-firebase-hooks/auth'
import {signOut} from 'firebase/auth'
//npm install firebase

function Header() {
    const categories = ["Health", "Food", "Travel", "Technology"]

    //get user data
    const [user] = useAuthState(auth);

    let navigate = useNavigate();

  return (
    <div className="header-container">
        <FaHome onClick={()=>navigate('/')}/>
        {
            user?
            <Link to='/addarticle' className="auth-link">Add Article</Link>
            :
            null
        }
        <div className="categories-container">
            {
                categories.map(item => <Link key={item} to={`/category/${item}`} className="nav-link">{item}</Link>)
            }
        </div>
        {
            user?
            <div>
                <span className="username">
                    {user.displayName}
                </span>
                <button className="auth-link" onClick={()=>signOut(auth)}>Logout</button>
            </div>
            :
            <Link to="/auth" className="auth-link">Sign Up</Link>
        }
    </div>
  )
}

export default Header