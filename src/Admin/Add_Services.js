import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import ANavbar from "../Components/Admin_Navbar";
import { query, collection, getDocs, where, addDoc, serverTimestamp } from "firebase/firestore";import Container from "react-bootstrap/esm/Container";
import '../Style.css'
import { ServiceShort } from "../Components/Service"
import Header from "../Components/Header";


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
  }, [user, loading]);
  return (
    <div className="dash">
    <div className="nav">
            <ANavbar />
   </div>
<Header />
   <div className="wrapper">

        <h1>Lis???? palveluita</h1>
            <div className="box-3">
            <h3>Lis???? kategoria</h3>
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
                <button className="colorBtn" onClick={() => handleCategoryClick(category)}>Lis???? kategoria</button>
                </div>
            </div>
            <div className="box-3">
             
               </div>
            <div className="box-3">
               
                <div>
                    <h3>Lis???? palvelu</h3>
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
                <div>Hinta (??? / k??ynti):</div>
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
                       Lis???? palvelu
                    </button>
                </div>
            </div>

   </div>
   </div>
  )
}


export default AddServices