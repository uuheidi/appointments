import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Login.css';
import {auth, db, logInWithEmailAndPassword} from '../firebase';
import { query, collection, getDocs, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const [role, setRole] = useState("");
    const navigate = useNavigate();

    const fetchRole = async () => {
        try {
          const q = query(collection(db, "users"), where("uid", "==", user?.uid));
          const doc = await getDocs(q);
          const data = doc.docs[0].data();
          setRole(data.role);
        } catch (err) {
          console.error(err);
        }
      };

    useEffect(() => {
        if (loading) {
          // maybe trigger a loading screen
          return;
        }
        
        if (user && role === "client") navigate("/client_dashboard");
        if (user && role === "professional") navigate("/professional_dashboard");
        fetchRole();
    }, [user, loading]);
  return (
    <div className="login">
        <div className='container'>
        <input
            type="text"
            class="txtBox"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail address"
        />
        <input
            type="password"
            class="txtBox"
            value={password}
            onChange={(p) => setPassword(p.target.value)}
            placeholder="**********"
        />

        <button
            className='btn'
            onClick={() => logInWithEmailAndPassword(email, password)}
        >
            Login
        </button>
        <div>
            <Link to="reset">Forgot password?</Link>
        </div>
        <div>
            Don't have an account yet? <Link to="register">Register</Link>
        </div>

        </div>
    </div>
  )
}

export default Login