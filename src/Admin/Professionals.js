import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import ANavbar from "../Components/Admin_Navbar";
import { query, collection, getDocs, where, setDoc, doc, deleteDoc } from "firebase/firestore";import Container from "react-bootstrap/esm/Container";
import './Professionals.css'

function AProfessionals() {

  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [place, setPlace] = useState("");
  const [office, setOffice] = useState("");
  const [address, setAddress] = useState("");
  const [postnumber, setPostnumber] = useState("");
  const [postalDistrict, setPostalDistrict] = useState("");
  const [phone, setPhone] = useState("")

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
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
    <div className="dash">
    <div className="nav">
    <ANavbar />
    </div>
    <div className="wrapper">
    <div className="box-3">Professionals</div>
    <div className="box-3">Professionals</div>
    <div className="box-3">
        <h3>Lisää ammattilainen
        </h3>
        <input
            type="text"
            value={firstName}
            className="profInput"
            placeholder="Etunimi"
            onChange={(n) => setFirstName(n.target.value)}
            />
        <input
            type="text"
            value={lastName}
            className="profInput"
            placeholder="Sukunimi"
            onChange={(n) => setLastName(n.target.value)}
            />
            <input
            type="text"
            value={place}
            className="profInput"
            placeholder="Paikkakunta"
            onChange={(p) => setPlace(p.target.value)}
            />
             <input
            type="text"
            value={office}
            className="profInput"
            placeholder="Toimipiste"
            onChange={(o) => setOffice(o.target.value)}
            />
             <input
            type="text"
            value={address}
            className="profInput"
            placeholder="Katuosoite"
            onChange={(p) => setAddress(p.target.value)}
            />
             <input
            type="text"
            value={postnumber}
            className="profInput"
            placeholder="Postinumero"
            onChange={(p) => setPostnumber(p.target.value)}
            />
             <input
            type="text"
            value={postalDistrict}
            className="profInput"
            placeholder="Postitoimipaikka"
            onChange={(p) => setPostalDistrict(p.target.value)}
            />
             <input
            type="text"
            value={phone}
            className="profInput"
            placeholder="Puhelinnumero"
            onChange={(p) => setPhone(p.target.value)}
            />
        
        <button className="profBtn">Lisää ammattilainen</button></div>
    </div>
    </div>
  )
}

export default AProfessionals