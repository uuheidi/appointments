import Login from '../Login/Login';
import Register from '../Register/Register';
import CDashboard from '../Client/Dashboard';
import Dashboard from '../Professional/Dashboard';
import Reset from '../Reset/Reset';
import PProfessionals from '../Professional/Professionals';
import PCalender from '../Professional/Calender';
import CServices from '../Client/Services';
import AddServices from '../Admin/Add_Services';
import AServices from '../Admin/Services';
import EditService from '../Admin/Edit_Service';
import AProfessionals from '../Admin/Professionals';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";



function Main() {
  return (
    <div className="app">
  <Router>
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="client_dashboard" element={<CDashboard />} />
      <Route path="professional_dashboard" element={<Dashboard />} />
      <Route path="reset" element={<Reset />} />
      <Route path="professional_professionals" element={<PProfessionals />} />
      <Route path="professional_calender" element={<PCalender />} />
      <Route path="client_services" element={<CServices />} />
      <Route path="add_services" element={<AddServices />} />
      <Route path="admin_services" element={<AServices />} />
      <Route path="edit_service/:name" element={<EditService />} />
      <Route path="admin_professionals" element={<AProfessionals />} />
    </Routes>
  </Router>
</div>
  );
}

export default Main;
