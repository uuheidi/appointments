import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import ANavbar from "../Components/Admin_Navbar";
import { query, collection, getDocs, where, addDoc, serverTimestamp } from "firebase/firestore";import Container from "react-bootstrap/esm/Container";
import '../Style.css'
import Header from "../Components/Header";

function AClients() {

  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [id, setId] = useState("");
  const [profileVisible, setProfileVisible] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [bookingVisible, setBookingVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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

  const fetchClients = async () => {
    try {
        const q = query(collection(db, "users"), where("role", "==", "client"));
        const doc = await getDocs(q);
        let users = [];
        doc.docs.map(user => {
            users.push(user.data())
        })
        setClients(users);
      } catch (err) {
        console.error(err);
      
      }
  }

  const handleClientClick = (first, last, email, phone, id) => {
    setProfileVisible(true);
    setFirstName(first);
    setLastName(last);
    setEmail(email);
    setPhone(phone);
    setId(id);
    setBookingVisible(false);
  }

  const handleLogClick = async () => {
    setBookingVisible(true);
    try {
        const q = query(collection(db, "appointments"), where("cid", "==", id));
        const doc = await getDocs(q);
        let appointmentsList = []; 
        doc.docs.map(item => {
            console.log(item.data());
            appointmentsList.push(item.data())
        })
        setAppointments(appointmentsList);
      } catch (err) {
        console.error(err);
      
      }
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchRole();
    fetchClients();
  }, [user, loading]);
  return (
    <div>
        <div className='nav'>
            <ANavbar />
        </div>
        <Header />
        <div className='wrapper'>
            <div className='box-3'>
            <input
        type="text"
        placeholder="Etsi asiakas"
        className="padInput"
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
      />

               {clients
          .filter(name => name.firstName.match(new RegExp(searchValue, "i")) || name.lastName.match(new RegExp(searchValue, "i")))
          .map(name => {
            return <button key={name.uid} className="colorBtn" onClick={() => handleClientClick(name.firstName, name.lastName, name.email, name.phone, name.uid)}>{name.lastName}, {name.firstName}</button>
              })}
            </div>
            <div className='box-3'>
               <div className={profileVisible ? "profileDiv visible" : "profileDiv"}> 
               <h3>{lastName}, {firstName}</h3>
               Sähköposti: {email}<br />
               Puhelinnumero: {phone}<br />
               <br />
               <button className="colorBtn" onClick={() => handleLogClick()}>Näytä varaus loki</button>
               </div>
            </div>
            <div className="box-3">
            <div className={bookingVisible ? "bookingDiv visible" : "bookingDiv"}> 
               {appointments.map(item => {
                return <div>Varaus tehty: <br />
                {item.timeBooked.toDate().toISOString()}<br />
                            Päivämäärä: {item.date}
                            <br />
                            Aika: {item.startTime}</div>
               })}
               </div>
            </div>
        </div>
    </div>
  )
}

export default AClients