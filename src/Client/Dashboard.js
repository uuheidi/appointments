import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import CNavbar from "../Components/Client_Navbar";
import { query, collection, getDocs, where } from "firebase/firestore";import Container from "react-bootstrap/esm/Container";
import './Style.css'

function CDashboard() {
    const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [value, onChange] = useState(new Date());

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);
  return (
    <div className="dash">
    <div className="nav">
            <CNavbar />
   </div>
   <div className="wrapper">

        <h1>Welcome {name}</h1>
            <div className="box-3">
            </div>
            <div className="box-3">
                Lorem ipsum
            </div>
            <div className="box-3">
                Lorem ipsum
            </div>

   </div>
   </div>
  )
}

export default CDashboard