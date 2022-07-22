import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, registerProfessionalWithEmailAndPassword } from "../firebase";
import { useNavigate } from "react-router-dom";
import ANavbar from "../Components/Admin_Navbar";
import { query, collection, getDocs, where, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";import Container from "react-bootstrap/esm/Container";
import '../Style.css'
import Professional_Profile from "../Components/Professional_Profile";
import Header from "../Components/Header";
import * as AiIcons from 'react-icons/ai';

function AProfessionals() {

  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [place, setPlace] = useState("");
  const [office, setOffice] = useState("");
  const [address, setAddress] = useState("");
  const [postnumber, setPostnumber] = useState("");
  const [postalDistrict, setPostalDistrict] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
  const [createdBy, setCreatedBy] = useState("");
  const [createdByName, setCreatedByName] = useState("");
  const [professionals, setProfessionals] = useState([]);
  const [profileVisible, setProfileVisible] = useState(false);
  const [profileFirstname, setProfileFirstname] = useState("");
  const [profileLastname, setProfileLastname] = useState("");
  const [profilePlace, setProfilePlace] = useState("");
  const [profileOffice, setProfileOffice] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [profilePostnumber, setProfilePostnumber] = useState("");
  const [profilePostalDistrict, setProfilePostalDistrict] = useState("");
  const [profilePhone, setProfilePhone] = useState("")
  const [createdAt, setCreatedAt] = useState("");
  const [closeVisible, setCloseVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(true);
  const [addingVisible, setAddingVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  

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

  const register = () => {
    let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let string_length = 8;
        let genPassword = '';
        for (var i=0; i<string_length; i++) {
            let rnum = Math.floor(Math.random() * chars.length);
            genPassword += chars.substring(rnum,rnum+1);
        }
        console.log(genPassword);
        

    try {
        
    registerProfessionalWithEmailAndPassword(firstName, lastName, place, office, address, postnumber, postalDistrict, phone, email, genPassword, user.uid, name);
    
}
    catch (err){
        console.log(err);
    }

};

  const handleProfClick = (firstname, lastname, place, office, address, postnumber, postal, phone, createdAt) => {
    setProfileVisible(true);
            setProfileFirstname(firstname)
            setProfileLastname(lastname);
            setProfilePlace(place);
            setProfileOffice(office);
            setProfileAddress(address);
            setProfilePostnumber(postnumber);
            setProfilePostalDistrict(postal);
            setProfilePhone(phone);
            setCreatedAt(createdAt);
  }

  const handleAddClick = () => {
    setAddingVisible(true);
    setCloseVisible(true);
    setAddVisible(false);
  }

  const handleCloseClick = () => {
    setAddingVisible(false);
    setCloseVisible(false);
    setAddVisible(true);
  }
  
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
    fetchRole();
    fetchProfessionals();
  }, [user, loading]);
  return (
    <div>
    <div className="nav">
    <ANavbar />
    </div>
    <Header />
    <div className="wrapper">
        <h1>Ammattilaiset</h1>
    <div className="box-3">
        <h3>Lista ammattilaisista</h3>
        <input
        type="text"
        placeholder="Etsi ammattilainen"
        className="padInput"
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
      />
        {professionals.filter(prof => prof.firstName.match(new RegExp(searchValue, "i")) || prof.lastName.match(new RegExp(searchValue, "i")))
          .map(prof => {
            return <button key={prof.createdAt} className="colorBtn" onClick={() => handleProfClick(prof.firstName, prof.lastName, prof.place, prof.office, prof.address, prof.postnumber, prof.postalDistrict, prof.phone, prof.createdAt)}>{prof.lastName}, {prof.firstName}</button>
            })}
    </div>
    <div className="box-3">
        <div className={profileVisible ? "profileDiv visible" : "profileDiv"}>
            <Professional_Profile
                firstname={profileFirstname}
                lastname={profileLastname}
                place={profilePlace}
                office={profileOffice}
                address={profileAddress}
                postnumber={profilePostnumber}
                postalDistrict={profilePostalDistrict}
                phone={profilePhone}
                />
        </div>
    </div>
    <div className="box-3 adding">
      <div className={closeVisible ? "closeDiv visible" : "closeDiv"}>
            <button className="round" onClick={() => handleCloseClick()}><AiIcons.AiOutlineClose /></button>
      </div>
      <div className={addVisible ? "addDiv visible" : "addDiv"}>
            <button className="round" onClick={() => handleAddClick()}><AiIcons.AiOutlineUserAdd /></button>
      </div>
      <div className={addingVisible ? "addingDiv visible" : "addingDiv"} >
        <h3>Lisää ammattilainen
        </h3>
        <input
            type="text"
            value={firstName}
            className="padInput"
            placeholder="Etunimi"
            onChange={(n) => setFirstName(n.target.value)}
            />
        <input
            type="text"
            value={lastName}
            className="padInput"
            placeholder="Sukunimi"
            onChange={(n) => setLastName(n.target.value)}
            />
            <input
            type="text"
            value={place}
            className="padInput"
            placeholder="Paikkakunta"
            onChange={(p) => setPlace(p.target.value)}
            />
             <input
            type="text"
            value={office}
            className="padInput"
            placeholder="Toimipiste"
            onChange={(o) => setOffice(o.target.value)}
            />
             <input
            type="text"
            value={address}
            className="padInput"
            placeholder="Katuosoite"
            onChange={(p) => setAddress(p.target.value)}
            />
             <input
            type="text"
            value={postnumber}
            className="padInput"
            placeholder="Postinumero"
            onChange={(p) => setPostnumber(p.target.value)}
            />
             <input
            type="text"
            value={postalDistrict}
            className="padInput"
            placeholder="Postitoimipaikka"
            onChange={(p) => setPostalDistrict(p.target.value)}
            />
             <input
            type="text"
            value={phone}
            className="padInput"
            placeholder="Puhelinnumero"
            onChange={(p) => setPhone(p.target.value)}
            />
            <input
            type="email"
            value={email}
            className="padInput"
            placeholder="Sähköpostiosoite"
            onChange={(p) => setEmail(p.target.value)}
            />
        <button className="colorBtn" onClick={() => register(firstName, lastName, place, office, address, postnumber, postalDistrict, phone, email)}>Lisää ammattilainen</button></div>
    </div>
    </div>
    </div>
  )
}

export default AProfessionals