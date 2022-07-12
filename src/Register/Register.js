import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, registerWithEmailAndPassword } from '../firebase';
import './Register.css';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [user, loading, error] = useAuthState(auth);
    const role = "client"
    const navigate = useNavigate();
    const register = () => {
        if (!name) alert("Please enter a name");
        registerWithEmailAndPassword(name, email, password, role);
    };
    useEffect(() => {
        if (loading) return;
        if (user) navigate("/")
        if (user) navigate.replace("/");
    }, [user, loading]);
  return (
    <div className='register'>
        <div className='container'>
            <input
                type="text"
                class="txtBox"
                value={name}
                onChange={(n) => setName(n.target.value)}
                placeholder="Firstname Lastname"
            />
            
            <input
                type="text"
                class="txtBox"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
            />

            <input
                type="password"
                class="txtBox"
                value={password}
                onChange={(p) => setPassword(p.target.value)}
                placeholder="********"
            />
        
            <button
                className='btn'
                onClick={register}
            >
                Register
            </button>
        <div>
            Already have an account? <Link to="/">Log in</Link>
        </div>
        </div>
    </div>
  )
}

export default Register