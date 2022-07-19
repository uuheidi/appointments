import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import CNavbar from "../Components/Client_Navbar";
import { query, collection, getDocs, updateDoc, where, doc, setDoc, serverTimestamp } from "firebase/firestore";
import Container from "react-bootstrap/esm/Container";
import './Style.css'
import Button from "react-bootstrap/esm/Button";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from "moment";
import Popup from "reactjs-popup";
import { Service } from "../Components/Service";



function Booking() {
    const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [categories, setCategories] = useState([{}]);
  const [services, setServices] = useState([{}]);
  const [serviceVisible, setServiceVisible] = useState(false);
  const [value, onChange] = useState(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [showDay, setShowDay] = useState(false);
  const [freeTimes, setFreeTimes] = useState([]);
  const [bookingVisible, setBookingVisible] = useState(false);
  const [timesVisible, setTimeVisible] = useState(false);
  const [sTime, setSTime] = useState("");
  const [takenTime, setTakenTime] = useState("");
  const [customer, setCustomer] = useState("");
  const [service, setService] = useState("");
  const [price, setPrice] = useState(0);
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState(new Date());
  const [id, setId] = useState("");
  const [pickedTime, setPickedTime] = useState("");
  const [bookingInfoVisible, setBookingInfoVisible] = useState(false);
  const [pickedService, setPickedService] = useState("");
  const [duration, setDuration] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      let path = `${data.firstName}, ${data.lastName}`
      setName(path);
      setFirstName(data.firstName);
      setLastName(data.lastName);
    } catch (err) {
      console.error(err);
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

  const fetchServices = async () => {
    try {
        const q = query(collection(db, "services"));
        const doc = await getDocs(q);
        let servi = [];
        doc.docs.map((serv) => {
            console.log("serv.data: ", serv.data())
            servi.push(serv.data())
        })
        setServices(servi);
      } catch (err) {
        console.error(err);
      }
  }

  const fetchTimes = async (value) => {
    try {
        console.log(value);
        const q = query(collection(db, "appointments"), where("date", "==", value), where("status", "==", "available"));
        const doc = await getDocs(q);
        console.log(q)
        console.log(doc)
        let times = [];
        doc.docs.map((time) => {
            times.push(time.data())
        })
        console.log(times)
        setFreeTimes(times);
      } catch (err) {
        console.error(err);
      }
  }

  const fetchID = async (value) => {
    try {
      const q = query(collection(db, "appointments"), where("date", "==", value), where("startTime", "==", pickedTime));
      const doc = await getDocs(q);
      console.log(q)
      console.log(doc)
      let fetchedId = "";
      doc.docs.map((item) => {
         fetchedId = item.id
      })
      setId(fetchedId);
    }
    catch {

    }
  }

  const fetchLength = async () => {
    try {
      const q = query(collection(db, "services"), where("name", "==", pickedService));
      const doc = await getDocs(q);
      console.log(q)
      console.log(doc)
      let length = "";
      doc.docs.map((item) => {
         length = item.data().time
      })
      setDuration(length);
    } catch (err) {
      console.error(err);
    }
  }

  const clickDay = (value) => {
    const fetchDate = moment(value).format("DD.MM.YYYY");
    fetchTimes(fetchDate)
    setDate(moment(value).format("DD.MM.YYYY"))
    setShowDay(true);
    setTimeVisible(true);
}

const book = async () => {

  const fetchDate = moment(value).format("DD.MM.YYYY");
  fetchID(fetchDate);
    try 
    {
        const refId = doc(db, "appointments", id);

        await updateDoc(refId, {
          cid: user.uid,
          customerFirstname: firstName,
          customerLastname: lastName,
          title: pickedService,
          status: "booked",
          timeBooked: serverTimestamp()
        });

        }
        catch (err) {
            console.log(err)
        }
}

const countLength = () => {
  let startTime = moment(pickedTime, "HH:mm");
  console.log("startTime: ", startTime)
  let countedEndTime = startTime.add(duration, 'minutes');
  setEndTime(countedEndTime);

}

const handleTimeClick = (time) => {
    setBookingVisible(true);
    fetchServices();
    setPickedTime(time);
    setBookingInfoVisible(false);
}

const ensureBooking = () => {
  setBookingInfoVisible(true);
  fetchLength();
  countLength();
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
                <Calendar onChange={onChange} value={value} onClickDay={() => clickDay(value)}/>
                
            </div>

          <div className="box-3">
          <div className={showDay ? "dayDiv visible" : "dayDiv"}>
            {console.log("freetimes: ",freeTimes)}
                    {
                        freeTimes.sort((a, b) => a.index - b.index).map(time => {
                            console.log("endTime:", endTime)
                            return <div><div className={timesVisible ? "timesDiv visible" : "timesDiv"}>

                                <button key={time.startTime} className="colorBtn" onClick={() => handleTimeClick(time.startTime)}>{time.startTime}</button>

                            </div>
                                    </div>
                        })
                    }
                    </div>
          </div>

          <div className="box-3">
            <div className={bookingVisible ? "bookingDiv visible" : "bookingDiv"}>
                    <select value={pickedService} onChange={(o) => setPickedService(o.target.value)}>
                      <option value="" disabled>Valitse palvelu</option>
                      {services.sort((a, b) => a.category.localeCompare(b.category)).map(item => {
                        return <option key={item.name} value={item.name}>{item.name}</option>
                      })}
                    </select>
                    <button className="colorBtn" onClick={() => ensureBooking()}>Siirry varaamaan aika</button>
                    <div className={bookingInfoVisible ? "bookingInfoDiv visible" : "bookingInfoDiv"}>
                     <h3>Tarkista vielä tiedot</h3>
                     Aika: {pickedTime} - {moment(endTime).format("HH:mm")}<br />
                     Päivämäärä: {moment(value).format("DD.MM.YYYY")} <br />
                      Palvelu: {pickedService}<br />
                      Kesto: {duration}<br /><br />
                      <button className="colorBtn" onClick={() => book()}>Varaa aika</button>
                      </div>
              
            </div>
          </div>
   </div>
   </div>
  )
}

export default Booking