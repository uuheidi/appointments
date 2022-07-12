import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import PNavbar from "../Components/Professional_Navbar";
import { query, collection, getDocs, where, setDoc, doc, addDoc } from "firebase/firestore";import Container from "react-bootstrap/esm/Container";
import './Services.css'
import Button from "react-bootstrap/esm/Button";
import Select from 'react-select';


function AServices() {
    const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [value, onChange] = useState(new Date());
  const [professional, setProfessional] = useState(true);
  const [role, setRole] = useState("");
  const [category, setCategory] = useState("");
  const {service, setService} = useState("");
  const [serviceName, setServiceName] = useState("");
  const [categories, setCategories] = useState([{}]);
  const [time, setTime] = useState(0);
  const [price, setPrice] = useState(0);
  const [serviceCat, setServiceCat] = useState("");
  const [description, setDescription] = useState("");
  const [servicesInCategories, setServicesInCategories] = useState([{}]);
  const [serviceVisible, setServiceVisible] = useState(false);
  let index = 0;

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

  const fetchCategories = async () => {
    try {
        const q = query(collection(db, "categories"));
        const doc = await getDocs(q);
        let cats =  [];
        doc.docs.map((d) => {
            cats.push(d.data())
        })
        console.log(cats[0].name)
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
        console.log(cat)
        console.log(q)
        console.log(doc)
        doc.docs.map((d) => {
            console.log("d.data: ", d.data())
            serv.push(d.data())
        })
        console.log("serv: ", serv)
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
        createdBy: user.uid
      });
      console.log("Added to database")
      window.location.reload(true);
  } 


  const handleSubmitService = async (service, cat, price, description) => {
   try {
    await addDoc(collection(db, "services"), {
        name: service,
        category: cat,
        price: price,
        createdAt: new Date(),
        createdBy: user.uid,
        description: description
      });
      console.log("Added to database");
    }
    catch (err) {
        console.log(err)
    }
  } 

  
 
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
    fetchCategories();
   /* if (!professional) return navigate("/"); */
  }, [user, loading]);
  return (
    <div className="dash">
    <div className="nav">
            <PNavbar />
   </div>
   <div className="wrapper">

        <h1>Lisää palveluita</h1>
            <div className="box-3">
               {categories.map((cat, id) => {
                return <div><Button key={id} onClick={() => fetchServices(cat.name)}>{cat.name}</Button></div>
               })}
            </div>
            <div className="box-3">
               {servicesInCategories.map((serv, id) => {
                return (<div key={id} className={serviceVisible ? "serviceDiv visible" : "serviceDiv"}>
                        <h3>{serv.name}</h3>
                        <div className="half">45 min</div>
                        <div className="half">{serv.price} €</div>
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
                <Button onClick={() => handleCategoryClick(category)}>Lisää kategoria</Button>
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
                        {categories.map(({name}) =>
                        <option value={name}>{name}</option>)}
                    </select>
                </div>
                <div>Hinta (€ / tunti):</div>
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
                    <Button onClick={() => handleSubmitService(serviceName, serviceCat, price, description)}>
                       Lisää palvelu
                    </Button>
                </div>
            </div>

   </div>
   </div>
  )
}


export default AServices