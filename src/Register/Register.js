import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, registerWithEmailAndPassword } from '../firebase';
import './Register.css';

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState("");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [user, loading] = useAuthState(auth);
    const role = "client"
    const navigate = useNavigate();
    const register = () => {
        if (password === passwordAgain) {
        try {
        registerWithEmailAndPassword(firstName, lastName, email, password, phone, role);
        navigate("/client_dashboard")
        }
        catch (err){
            console.log(err);
        }
    }
    else {
        alert("Salasanat eivät täsmää.")
    }
    };
    useEffect(() => {
        if (loading) return;
        if (user) navigate("/")
    }, [user, loading]);
  return (
    <div className='register'>
        <div className='container'>
            <input
                type="text"
                className="txtBox"
                value={firstName}
                onChange={(n) => setFirstName(n.target.value)}
                placeholder="Etunimi"
            />
             <input
                type="text"
                className="txtBox"
                value={lastName}
                onChange={(n) => setLastName(n.target.value)}
                placeholder="Sukunimi"
            />
            
            <input
                type="text"
                className="txtBox"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Sähköpostiosoite"
            />

            <input
                type="password"
                className="txtBox"
                value={password}
                onChange={(p) => setPassword(p.target.value)}
                placeholder="Salasana"
            />
            <input
                type="password"
                className="txtBox"
                value={passwordAgain}
                onChange={(p) => setPasswordAgain(p.target.value)}
                placeholder="Salasana uudestaan"
            />
             <input
                type="text"
                className="txtBox"
                value={phone}
                onChange={(n) => setPhone(n.target.value)}
                placeholder="Puhelinnumero"
            />
            
            <button
                className='btn'
                onClick={register}
            >
                Rekisteröidy
            </button>
        <div>
            Onko sinulla jo tunnus? <Link to="/">Kirjaudu sisään!</Link>
        </div>
        </div>
    </div>
  )
}

export default Register