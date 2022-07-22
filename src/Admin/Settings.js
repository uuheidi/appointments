import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, changePassword } from "../firebase";
import { useNavigate } from "react-router-dom";
import ANavbar from "../Components/Admin_Navbar";
import { query, collection, getDocs, where, addDoc, serverTimestamp } from "firebase/firestore";import Container from "react-bootstrap/esm/Container";
import '../Style.css'
import { ServiceShort } from "../Components/Service"
import Header from "../Components/Header";


function ASettings() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      let path = `${data.firstName}, ${data.lastName}`
      setName(path);
      setEmail(data.email);
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


const handleClickChangePassword = (password, newPassword, oldPassword) => {
    if (password === newPassword) {
        try {
        changePassword(newPassword, oldPassword);
        setPassword("");
        setOldPassword("");
        setNewPassword("");
        }
        catch (err) {
            console.error(err)
        }
    }
    else {
       alert("Salasanat eivät täsmää.")
    }
}

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
    fetchRole();
  }, [user, loading]);
  return (
    <div className="dash">
    <div className="nav">
            <ANavbar />
   </div>
<Header />
   <div className="wrapper">

        <h1>Asetukset</h1>
            <div className="box-3">
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder={email}
                    className="padInput"
                    />
                <button className="colorBtn">Vaihda sähköpostiosoite</button>
              </div>
              <div className="box-3">
              <input 
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)} 
                    placeholder="Nykyinen salasana"
                    className="padInput"
                    />
              <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Uusi salasana"
                    className="padInput"
                    />
                <input 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="Uusi salasana uudestaan"
                    className="padInput"
                    />
                <button className="colorBtn" onClick={() => handleClickChangePassword(password, newPassword, oldPassword)}>Vaihda salasana</button>
              </div>

   </div>
   </div>
  )
}


export default ASettings