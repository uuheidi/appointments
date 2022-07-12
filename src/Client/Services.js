import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import CNavbar from "../Components/Client_Navbar";
import { query, collection, getDocs, updateDoc, where, doc, setDoc, serverTimestamp } from "firebase/firestore";
import Container from "react-bootstrap/esm/Container";
import './Services.css'
import Button from "react-bootstrap/esm/Button";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from "moment";
import Popup from "reactjs-popup";



function Dashboard() {
    const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [categories, setCategories] = useState([{}]);
  const [services, setServices] = useState([{}]);
  const [serviceVisible, setServiceVisible] = useState(false);
  const [value, onChange] = useState(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [showDay, setShowDay] = useState(false);
  const [freeTimes, setFreeTimes] = useState([{}]);
  const [bookingVisible, setBookingVisible] = useState(false);
  const [timesVisible, setTimeVisible] = useState(false);
  const [sTime, setSTime] = useState("");
  const [takenTime, setTakenTime] = useState("");
  const [customer, setCustomer] = useState("");
  const [service, setService] = useState("");
  const [price, setPrice] = useState(0);
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState(new Date());
  const [slotId, setSlotId] = useState("");
  
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

  const fetchTimes = async (value) => {
    try {
        const fetchDate = value.toDateString("DD/MM/YYYY");
        const q = query(collection(db, "appointments"), where("date", "==", fetchDate), where("status", "==", "available"));
        const doc = await getDocs(q);
        let times = [];
        doc.docs.map((time) => {
            times.push(time.data())
        })
        console.log(times)
        setFreeTimes(times);
      } catch (err) {
        console.error(err);
        alert("An error occured while fetching user data");
      }
  }

  const clickDay = (value) => {
    fetchTimes(value)
    setDate(value.toDateString("DD/MM/YYYY"))
    setShowDay(true);
    setTimeVisible(true);
}

const handleServiceClick = (service, price, time) => {
    setService(service);
    setPrice(price);
    setTakenTime(time);
    setCalendarVisible(true);
}


const handleClickBook = async (time) => {
    try {
        console.log("Date: ", date)
        console.log("sTime: ", time)
        const q = query(collection(db, "appointments"), where("date", "==", date), where("startTime", "==", time));
        const doc = await getDocs(q);
        console.log(doc)
        console.log(doc.docs[0].id)
        const slot = doc.docs[0].id;
        setSlotId(slot);

        book(slot)
        }
        catch (err) {
            console.log(err)
        }
}

const book = async (slot) => {
    try 
    {
        const refId = doc(db, "appointments", slot);

        await updateDoc(refId, {
          cid: user.uid,
          customer: name,
          title: service,
          status: "taken",
          booked: serverTimestamp()
        });

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
  }, [user, loading]);
  return (
    <div className="dash">
    <div className="nav">
            <CNavbar />
   </div>
   <div className="wrapper">

        <h1>Welcome {name}</h1>
            <div className="box-3">
                {
                    categories.map((cat, id) => {
                        return (<div key={id}>
                            <Button onClick={() => fetchServices(cat.name)}>{cat.name}</Button>
                        </div>)
                    })
                }
            </div>
            <div className="box-3">
                {
                    services.map((serv, id) => {
                        console.log("Servprice: ", serv.price)
                        return ( <div key={id} onClick={() => handleServiceClick(serv.name, serv.price, serv.time)} className={serviceVisible ? "serviceDiv visible" : "serviceDiv"}>
                            <h3>{serv.name}</h3>
                            <p>{serv.description}</p>
                            <div className="half"><small>Time</small><br />{serv.time} min</div>
                            <div className="half"><small>Price</small><br />{serv.price} €</div>
                        </div>)
                    })
                }
            </div>
            <div className="box-3">
                <div className={calendarVisible ? "calendarDiv visible" : "calendarDiv"}>
                <Calendar onChange={onChange} value={value} onClickDay={() => clickDay(value)}/>
                </div> 
                <div className={showDay ? "dayDiv visible" : "dayDiv"}>
                    {
                        freeTimes.sort((a, b) => a.index - b.index).map(time => {
                            console.log("endTime:", endTime)
                            return <div><div className={timesVisible ? "timesDiv visible" : "timesDiv"}><Popup trigger={<Button onClick={() => setSTime(time.startTime)}>{time.startTime}</Button>} position="right center">
                            <div> 
                            
                                Asiakas: {name}<br />
                                Palvelu: {service}<br />
                                Aika: {takenTime}<br />
                                Hinta: {price}<br />
                        <Button onClick={() => handleClickBook(time.startTime)}>Varaa {time.startTime}</Button></div>
                          </Popup></div>
                                    </div>
                        })
                    }
                    </div>
            </div>

   </div>
   </div>
  )
}

export default Dashboard