import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import ANavbar from "../Components/Admin_Navbar";
import { query, collection, getDocs, where, setDoc, doc, deleteDoc } from "firebase/firestore";import Container from "react-bootstrap/esm/Container";
import './Edit_Service.css'
import { useParams } from "react-router-dom";
import { Service } from "../Components/Service"



function EditService() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const {service, setService} = useState("");
  const [categories, setCategories] = useState([{}]);
  const [fetchedName, setFetchedName] = useState("");
  const [fetchedDesription, setFetchedDescription] = useState("");
  const [fetchedTime, setFetchedTime] = useState(0);
  const [fetchedPrice, setFetchedPrice] = useState(0);
  const [fetchedCat, setFetchedCat] = useState("");
  const [id, setId] = useState("");
  let params = useParams();

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
        const q = query(collection(db, "services"), where("name", "==", params.name));
        const doc = await getDocs(q);
        let serv =  [];
        doc.docs.map((d) => {
            setId(d.id);
            serv.push(d.data())
        })
        setFetchedCat(serv[0].category);
        setFetchedDescription(serv[0].description);
        setFetchedName(serv[0].name);
        setFetchedPrice(serv[0].price);
        setFetchedTime(serv[0].time);
      } catch (err) {
        console.error(err);
  }
}


  const handleSubmitService = async (service, cat, time, price, description) => {
   try {
    await setDoc(doc(db, "services", id), {
        name: service,
        category: cat,
        price: price,
        time: time,
        createdAt: new Date(),
        createdBy: user.uid,
        createdByName: name,
        description: description
      });
      console.log("Added to database");
      window.location.reload(true);
    }
    catch (err) {
        console.log(err)
    }
  } 

  const handleDeleteService = async () => {
    await deleteDoc(doc(db, "services", id));
    navigate("/admin_services");
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
    fetchRole();
    fetchCategories();
    fetchServices();
    
  }, [user, loading]);
  return (
    <div className="dash">
    <div className="nav">
            <ANavbar />
   </div>
   <div className="wrapper">

        <h1>Muokkaa palvelua</h1>
            
            <div className="box-3">
                <Service
                      name={fetchedName}
                      cat={fetchedCat}
                      description={fetchedDesription}
                      time={fetchedTime}
                      price={fetchedPrice}
                      />
               </div>
            <div className="box-3" style={{paddingLeft:10}}>
                <div>
                    <h3>Muokkaa palvelua</h3>
                </div>
                <div>
                    <input
                        type="text"
                        value={fetchedName}
                        className="txtBox"
                        placeholder={fetchedName}
                        onChange={(s) => setFetchedName(s.target.value)}
                         />
                         {console.log(service)}
                </div>
                <div>
                <select
                    value={fetchedCat}
                    onChange={(c) => setFetchedCat(c.target.value)}>
                      <option value="" disabled>Valitse kategoria</option>
                        {categories.map(({name}) =>
                        <option key={name} value={name}>{name}</option>)}
                    </select>
                </div>
                <div>Kesto minuuteissa:</div>
                <div>
                    <input
                        type="number"
                        value={fetchedTime}
                        className="txtBox"
                        onChange={(p) => setFetchedTime(p.target.value)} />
                </div>
                <div>Hinta (€ / käynti):</div>
                <div>
                    <input
                        type="number"
                        value={fetchedPrice}
                        className="txtBox"
                        onChange={(p) => setFetchedPrice(p.target.value)} />
                </div>
                <div>
                    <textarea
                        value={fetchedDesription}
                        placeholder={fetchedDesription}
                        onChange={(d) => setFetchedDescription(d.target.value)}
                    ></textarea>
                </div>
                <div>
                    <button className="serviceBtn" onClick={() => handleSubmitService(fetchedName, fetchedCat, fetchedTime, fetchedPrice, fetchedDesription)}>
                       Tallenna muutokset
                    </button>
                    <button className="deleteBtn" onClick={() => handleDeleteService()}>
                       Poista palvelu
                    </button>
                </div>
            </div>
        </div>
   </div>
  )
}


export default EditService