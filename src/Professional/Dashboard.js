import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import PNavbar from "../Components/Professional_Navbar";
import { query, collection, getDocs, where } from "firebase/firestore";import Container from "react-bootstrap/esm/Container";
import '../Style.css'


function Dashboard() {
    const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [value, onChange] = useState(new Date());
  const [professional, setProfessional] = useState(true);
  const [role, setRole] = useState("");
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
  const fetchRole = async () => {
    try {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        const dataRole = data.role;
        setRole(dataRole);
        console.log(role)
      } catch (err) {
        console.error(err);
        alert("An error occured while fetching user data");
      }

    if (role === "professional") {
        setProfessional(true);
    }
    else {
       setProfessional(false);
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
    fetchRole();
    if (!professional) return navigate("/");
  }, [user, loading]);
  return (
    <div className="dash">
    <div className="nav">
            <PNavbar />
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

export default Dashboard