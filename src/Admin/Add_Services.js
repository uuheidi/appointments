import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import ANavbar from "../Components/Admin_Navbar";
import { query, collection, getDocs, where, addDoc, serverTimestamp } from "firebase/firestore";import Container from "react-bootstrap/esm/Container";
import './Style.css'
import { ServiceShort } from "../Components/Service"



function AddServices() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const {service, setService} = useState("");
  const [serviceName, setServiceName] = useState("");
  const [categories, setCategories] = useState([{}]);
  const [time, setTime] = useState(45);
  const [price, setPrice] = useState(105);
  const [serviceCat, setServiceCat] = useState("");
  const [description, setDescription] = useState("");
  const [servicesInCategories, setServicesInCategories] = useState([{}]);
  const [serviceVisible, setServiceVisible] = useState(false);

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

  const handleCategoryClick = async (cat) => {
    await addDoc(collection(db, "categories"), {
        name: cat,
        createdAt: new Date(),
        createdByName: name,
        createdBy: user.uid
      });
      console.log("Added to database")
      window.location.reload(true);
  } 


  const handleSubmitService = async (service, cat, time, price, description) => {
   try {
    await addDoc(collection(db, "services"), {
        name: service,
        category: cat,
        time: time,
        price: price,
        createdAt: serverTimestamp(),
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

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
    fetchRole();
    fetchCategories();
  }, [user, loading]);
  return (
    <div className="dash">
    <div className="nav">
            <ANavbar />
   </div>
   <div className="wrapper">

        <h1>Lisää palveluita</h1>
            <div className="box-3">
               {categories.map((cat, id) => {
                return <div key={id}><button className="colorBtn" onClick={() => fetchServices(cat.name)}>{cat.name}</button></div>
               })}
            </div>
            <div className="box-3">
               {servicesInCategories.map((serv, id) => {
                return (<div key={id} className={serviceVisible ? "serviceDiv visible" : "serviceDiv"}>
                        <ServiceShort
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
            <div className="box-3">
                <h3>Lisää palvelu kategoria</h3>
               <div>
                <input 
                    type="text"
                    value={category}
                    className="txtBox"
                    onChange={(c) => setCategory(c.target.value)}
                    placeholder="Kategorian nimi"
                    />
                </div>
                <div>
                <button className="colorBtn" onClick={() => handleCategoryClick(category)}>Lisää kategoria</button>
                </div>
                <div>
                    <h3>Lisää palvelu</h3>
                </div>
                <div>
                    <input
                        type="text"
                        value={serviceName}
                        className="txtBox"
                        placeholder="Palvelun nimi"
                        onChange={(s) => setServiceName(s.target.value)}
                         />
                         {console.log(service)}
                </div>
                <div>
                <select
                    value={serviceCat}
                    onChange={(c) => setServiceCat(c.target.value)}>
                      <option value="">Valitse kategoria</option>
                        {categories.map(({name}) =>
                        <option key={name} value={name}>{name}</option>)}
                    </select>
                </div>
                <div>Kesto (0-60 min):</div>
                <div>
                    <input
                        type="number"
                        value={time}
                        className="txtBox"
                        onChange={(p) => setTime(p.target.value)} />
                </div>
                <div>Hinta (€ / käynti):</div>
                <div>
                    <input
                        type="number"
                        value={price}
                        className="txtBox"
                        onChange={(p) => setPrice(p.target.value)} />
                </div>
                <div>
                    <textarea
                        value={description}
                        placeholder="Kuvaus palvelusta"
                        onChange={(d) => setDescription(d.target.value)}
                    ></textarea>
                </div>
                <div>
                    <button className="colorBtn" onClick={() => handleSubmitService(serviceName, serviceCat, time, price, description)}>
                       Lisää palvelu
                    </button>
                </div>
            </div>

   </div>
   </div>
  )
}


export default AddServices