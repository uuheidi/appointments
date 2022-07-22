import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import CNavbar from "../Components/Client_Navbar";
import { query, collection, getDocs, updateDoc, where, doc, setDoc, serverTimestamp } from "firebase/firestore";

import '../Style.css'
import { Service } from "../Components/Service";



function CServices() {
    const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [categories, setCategories] = useState([{}]);
  const [services, setServices] = useState([{}]);
  const [serviceVisible, setServiceVisible] = useState(false);

  const fetchCategories = async () => {
    try {
      const q = query(collection(db, "categories"));
      const doc = await getDocs(q);
      let cats = [];
      doc.docs.map((cat) => {
        cats.push(cat.data());
      })
      setCategories(cats);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  const fetchServices = async (cat) => {
    try {
        const q = query(collection(db, "services"), where("category", "==", cat));
        const doc = await getDocs(q);
        let servi = [];
        doc.docs.map((serv) => {
            servi.push(serv.data())
        })
        console.log(servi[0].price)
        setServices(servi);
        setServiceVisible(true);
      } catch (err) {
        console.error(err);
        alert("An error occured while fetching user data");
      }
  }



  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchCategories();
  }, [user, loading]);
  return (
    <div className="dash">
    <div className="nav">
            <CNavbar />
   </div>
   <div className="wrapper">

        <h1>Palvelut</h1>
            <div className="box-3">
                {
                    categories.map((cat, id) => {
                        return (<div key={id}>
                            <button class="colorBtn" onClick={() => fetchServices(cat.name)}>{cat.name}</button>
                        </div>)
                    })
                }
            </div>
            <div className="box-6">
                {
                    services.map((serv, id) => {
                        console.log("Servprice: ", serv.price)
                        return ( <div key={id} className={serviceVisible ? "serviceDiv visible" : "serviceDiv"}>
                           
                           <Service
                            name={serv.name}
                            cat={serv.category}
                            description={serv.description}
                            time={serv.time}
                            price={serv.price}
                            />
                           
                           </div>)
                    })
                }
            </div>
            

   </div>
   </div>
  )
}

export default CServices