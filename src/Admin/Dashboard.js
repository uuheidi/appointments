import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import ANavbar from "../Components/Admin_Navbar";
import { query, collection, getDocs, where, addDoc, serverTimestamp } from "firebase/firestore";import Container from "react-bootstrap/esm/Container";
import './Style.css'

function ADashboard() {

  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      let path = `${data.firstName}, ${data.lastName}`
      setName(path);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRole = async () => {
    try {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        checkRole(data.role);
      } catch (err) {
        console.error(err);
      
      }
    
  }
  const checkRole = (role) => {
    if (role != "admin") {
     return navigate("/"); 
  }
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
    fetchRole();
  }, [user, loading]);
  return (
    <div>
        <div className='nav'>
            <ANavbar />
        </div>
        <div className='wrapper'>
            <h1>Tervetuloa {name}</h1>
            <div className='box-3'>
                Ammattilaistiedot tähän
            </div>
            <div className='box-3'>
            </div>
            <div className="box-3">
                Asiakastiedot tähän
            </div>
        </div>
    </div>
  )
}

export default ADashboard