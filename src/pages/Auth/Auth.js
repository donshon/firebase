import React, {useState} from 'react'
import './Auth.css'
import {auth} from './../../config/firebaseConfig';
import {createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword} from 'firebase/auth'
import {useNavigate} from 'react-router-dom';

function Auth() {
    //state to control which form to show
    const [existingUser, setExistingUser] = useState(false)
    //state for user info
    const [email, setEmail] = useState('')
    const [passwrd, setPasswrd] = useState('')
    const [name, setName] = useState('')

    let navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        //call funtion to create user
        createUserWithEmailAndPassword(auth, email, passwrd)
        .then( res => {
            //console.log(res.user)
            //add username as display name
            updateProfile(auth.currentUser, {
                displayName: name
            })
            navigate('/')
        })
        .catch(err => console.log(err))
    }

    const handleLogin = (e) => {
        e.preventDefault();
        //login
        signInWithEmailAndPassword(auth, email, passwrd)
        .then(res => {
            console.log(res)
            navigate('/')
        })
        .catch(err => {
            alert(err.com)
        })
    }

  return (
    <div className="auth-container">
        {
            existingUser?
            <form className="auth-form" onSubmit={handleLogin}>
                <h1>Login with your email</h1>
                <div className="form-group">
                    <input type="email"
                        onChange={(e)=>{setEmail(e.target.value)}}
                        placeholder="Enter your email"
                        required
                    />
                    <input type="password"
                        onChange={(e)=>{setPasswrd(e.target.value)}}
                        placeholder="Enter password"
                        required
                    />
                </div>
                <button type="submit" >Login</button>
                <p>Don't have an account? <span className="form-link" onClick={()=>setExistingUser(false)}>Sign up</span></p>
            </form>
            :
            <form className="auth-form" onSubmit={handleSignup}>
                <h1>Sign up with your email</h1>
                <div className="form-group">
                    <input type="text"
                        onChange={(e)=>{setName(e.target.value)}}
                        placeholder="Enter your name"
                        required
                    />
                    <input type="email"
                        onChange={(e)=>{setEmail(e.target.value)}}
                        placeholder="Enter your email"
                        required
                    />
                    <input type="password"
                        onChange={(e)=>{setPasswrd(e.target.value)}}
                        placeholder="Enter password"
                        required
                    />                 
                </div>
                <button type="submit">Register</button>
                <p>Already have an account? <span className="form-link" onClick={()=>setExistingUser(true)}>Login</span></p>
            </form>
        }
    </div>
  )
}

export default Auth