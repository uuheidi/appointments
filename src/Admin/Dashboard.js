import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import ANavbar from "../Components/Admin_Navbar";
import { query, collection, getDocs, where, addDoc, serverTimestamp } from "firebase/firestore";import Container from "react-bootstrap/esm/Container";
import '../Style.css'
import { map } from "@firebase/util";
import Header from "../Components/Header";

function ADashboard() {

  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [professionals, setProfessionals] = useState([]);
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);

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


  const fetchProfessionals = async () => {
    try {
        const q = query(collection(db, "users"), where("role", "==", "professional"));
        const doc = await getDocs(q);
        let prof = [];
        doc.docs.map((d) => {
            prof.push(d.data())
            
        })
        setProfessionals(prof);
      } catch (err) {
        console.error(err);
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

  const fetchAppointments = async () => {
    try {
        const q = query(collection(db, "appointments"), where("status", "==", "booked"));
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
    fetchUserName();
    fetchRole();
    fetchProfessionals();
    fetchClients();
    fetchAppointments();
  }, [user, loading]);
  return (
    <div>
        <div className='nav'>
            <ANavbar />
        </div>
        <Header />
        <div className='wrapper'>
            <h1>Tervetuloa {name}</h1>
            <div className='box-3'>
                <h3>Ammattilaiset</h3>
                Ammattilaisia yhteensä: {professionals.length}<br /><br />
                {professionals.map(item => {
                    return <li key={item.uid}>{item.lastName}, {item.firstName}</li>
                })}
            </div>
            <div className='box-3'>
                <h3>Asiakkaat</h3>
                Asiakkaita yhteensä: {clients.length}<br /><br />
                {clients.map(item => {
                    return <li key={item.uid}>{item.lastName}, {item.firstName}</li> 
                })}
            </div>
            <div className="box-3">
               <h3>Viimeisimmät varaukset</h3>
               <ul>
               {appointments.slice(0, 10).map(item => {
                    return <li key={item.uid}>{item.date}, {item.startTime}</li> 
                })}
                </ul>
            </div>
        </div>
    </div>
  )
}

export default ADashboard