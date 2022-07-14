import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import ANavbar from "../Components/Admin_Navbar";
import { query, collection, getDocs, where } from "firebase/firestore";import Container from "react-bootstrap/esm/Container";
import './Services.css'
import { Service } from "../Components/Service"



function AServices() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([{}]);
  const [servicesInCategories, setServicesInCategories] = useState([{}]);
  const [serviceVisible, setServiceVisible] = useState(false);
  
  
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

  const fetchCategories = async () => {
    try {
        const q = query(collection(db, "categories"));
        const doc = await getDocs(q);
        let cats =  [];
        doc.docs.map((d) => {
            cats.push(d.data())
        })
        setCategories(cats);
      } catch (err) {
        console.error(err);
  }
}

const fetchServices = async (cat) => {
    
  try {
      const q = query(collection(db, "services"), where("category", "==", cat));
      const doc = await getDocs(q);
      let serv =  [];
      doc.docs.map((d) => {
          serv.push(d.data())
      })
      setServicesInCategories(serv);
      setServiceVisible(true);
    } catch (err) {
      console.error(err);
}
}

  const navToAddService = () => {
    navigate("../add_services")
  }


const navToEdit = (name) => {
  navigate(`/edit_service/${name}`)
}

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchRole();
    fetchCategories();
  }, [user, loading]);
  return (
    <div className="dash">
    <div className="nav">
            <ANavbar />
   </div>
   <div className="wrapper">

        <h1>Palvelut </h1>
            <div className="box-3">
            {categories.map((cat, id) => {
                return <div key={id}><button className="serviceBtn" onClick={() => fetchServices(cat.name)}>{cat.name}</button></div>
               })}
            </div>
            <div className="box-6">
              <div className="addService">
                <button className="serviceBtn" onClick={() => navToAddService()}>Lisää palvelu</button>
            </div>
            {servicesInCategories.map((serv, id) => {
                return (<div key={id} className={serviceVisible ? "serviceDiv visible" : "serviceDiv"}>
                        
                         <Service
                            name={serv.name}
                            cat={serv.category}
                            description={serv.description}
                            time={serv.time}
                            price={serv.price}
                            />

                            <div className="row">
                        <div className="box-3">
                        <button className="serviceBtn" onClick={() => navToEdit(serv.name)}>Muokkaa</button>
                          </div>
                          </div>
                        <hr />
                </div>)
               })
            }
            </div>

   </div>
   </div>
  )
}

export default AServices