import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import PNavbar from "../Components/Professional_Navbar";
import { query, collection, getDocs, where, addDoc, serverTimestamp } from "firebase/firestore";import Container from "react-bootstrap/esm/Container";
import './Calender.css'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from "moment";
import Button from "react-bootstrap/esm/Button";


function PCalender() {
    const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [value, onChange] = useState(new Date());
  const [showDay, setShowDay] = useState(false) 
  const [event, setEvent] = useState(null)
  const [dayStart, setDayStart] = useState("");
  const [dayEnd, setDayEnd] = useState("");
  const [hoursStart, setHoursStart] = useState(moment());
  const [hoursEnd, setHoursEnd] = useState(moment());
  const [startAsDate, setStartAsDate] = useState(Date());
  const [endAsDate, setEndAsDate] = useState(Date());
 const [info, setInfo] = useState(false)
 const [professional, setProfessional] = useState(false);
 const [role, setRole] = useState("");
 const [timeSlots, setTimeSlots] = useState([]);
 
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
        const dataRole = data.role;
        setRole(dataRole);
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
  }, [user, loading]);

  const createTimeSlots = (fromTime, toTime) => {
    let startTime = moment(fromTime, "HH:mm");
    let endTime = moment(toTime, "HH:mm");
    
    if(endTime.isBefore(startTime)){
        endTime.add(1, 'day');
    }
    let arr=[];
    while(startTime<=endTime){
        setHoursStart(startTime);
        console.log("Start time: " + startTime)
        arr.push(moment(startTime).format("HH:mm"));
        startTime.add(60, 'minutes');
        console.log("Start time + 30 mins: " + startTime)
        setHoursEnd(startTime);
        console.log("hoursStart: " + hoursStart + " hoursEnd: " + hoursEnd);
        
        setStartAsDate(hoursStart.toDate());
        setEndAsDate(hoursEnd.toDate());

    }
    return arr;
}
    const addToDatabase = async (startTime, index) => {
    try {
        await addDoc(collection(db, "appointments"), {
            index: index,
            pid: user.uid,
            cid: "",
            customerFirstname: "",
            customerLastname: "",
            title: "",
            date: moment(value).format("DD.MM.YYYY"),
            startTime: startTime,
            professional: name,
            status: "available",
            timeCreated: serverTimestamp(),
            timeBooked: "",
            compilation: ""
          })
        }
    catch (error) {
        console.log(error);
    }
    }

    const handleDayStart = (e) => {
        setDayStart(e.target.value)
    }

    const handleDayEnd = (e) => {
        setDayEnd(e.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setTimeSlots(createTimeSlots(dayStart, dayEnd));
        let index = 0;
        timeSlots.map((times) => { 
            index += 1
           addToDatabase(times, index)
        })
    }

    const clickDay = () => {
        setShowDay(true);
    }

 

  return (
    <div className="dash">
    <div className="nav">
            <PNavbar />
   </div>
   <div className="wrapper">
    <div className="box-3">
   <Calendar onChange={onChange} value={value} onClickDay={() => clickDay()}/>
    </div>
    <div className="box-3">
        <div className={showDay ? 'day-details active' : 'day-details'}>
        <div>
       <form onSubmit={handleSubmit}>
       <h3>Valitse työskentelytunnit päivälle {moment(value).format("DD.MM.YYYY")}:</h3>
       <div>
       <label>Aloitusaika:</label>
       </div>
       <div>
       <select onChange={handleDayStart}>
       <option value="01:00">01:00</option>
        <option value="02:00">02:00</option>
        <option value="03:00">03:00</option>
        <option value="04:00">04:00</option>
        <option value="05:00">05:00</option>
        <option value="06:00">06:00</option>
        <option value="07:00">07:00</option>
        <option value="08:00">08:00</option>
        <option value="09:00">09:00</option>
        <option value="10:00">10:00</option>
        <option value="11:00">11:00</option>
        <option value="12:00">12:00</option>
        <option value="13:00">13:00</option>
        <option value="14:00">14:00</option>
        <option value="15:00">15:00</option>
        <option value="16:00">16:00</option>
        <option value="17:00">17:00</option>
        <option value="18:00">18:00</option>
        <option value="19:00">19:00</option>
        <option value="20:00">20:00</option>
        <option value="21:00">21:00</option>
        <option value="22:00">22:00</option>
        <option value="23:00">23:00</option>
        <option value="00:00">00:00</option>
       </select>
       </div>
       <div>
       <label>Lopetusaika:</label>
       </div>
       <div>
       <select onChange={handleDayEnd}>
       <option value="01:00">01:00</option>
        <option value="02:00">02:00</option>
        <option value="03:00">03:00</option>
        <option value="04:00">04:00</option>
        <option value="05:00">05:00</option>
        <option value="06:00">06:00</option>
        <option value="07:00">07:00</option>
        <option value="08:00">08:00</option>
        <option value="09:00">09:00</option>
        <option value="10:00">10:00</option>
        <option value="11:00">11:00</option>
        <option value="12:00">12:00</option>
        <option value="13:00">13:00</option>
        <option value="14:00">14:00</option>
        <option value="15:00">15:00</option>
        <option value="16:00">16:00</option>
        <option value="17:00">17:00</option>
        <option value="18:00">18:00</option>
        <option value="19:00">19:00</option>
        <option value="20:00">20:00</option>
        <option value="21:00">21:00</option>
        <option value="22:00">22:00</option>
        <option value="23:00">23:00</option>
        <option value="00:00">00:00</option>
       </select>
       </div>
       <input type="submit" value="Submit" />
       </form>
            </div>
        </div>
    </div>
   </div>
   </div>
  )
}

export default PCalender