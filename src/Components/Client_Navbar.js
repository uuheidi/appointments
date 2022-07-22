import React, {useState, useEffect} from 'react'
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { NavItem } from 'react-bootstrap';
import { SidebarDataProfessional, SidebarDataClient  } from './SidebarData'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "../firebase";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/esm/Button';
import { collection, getDocs, query, where } from "firebase/firestore";
import './Navbar.css';

function CNavbar() {
    const [sidebar, setSidebar] = useState(false);
    const [user, loading, error] = useAuthState(auth);
    const [professional, setProfessional] = useState(false);
    const [role, setRole] = useState("");
    const navigate = useNavigate();
    
  

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
      }, [user, loading]);

    const showSidebar = () => setSidebar(!sidebar);
  return (
    <div>
        <div className='navbar'>
            <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar}/>
            </Link>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
            <ul className='nav-menu-items'>
                <li className='navbar-toggle'>
                    <Link to="#" className='menu-bars'>
                        <AiIcons.AiOutlineClose onClick={showSidebar}/>
                    </Link>
                </li>

                {SidebarDataClient.map((page, index) => {
                    return (
                        <li key={index} className={page.cName}>
                            <Link to={page.path}><Button>
                            <span className="icon">{page.icon}</span>
                                <span className='title'>{page.title}</span>
                                </Button>
                            </Link>
                        </li>
                    )
                }) 
                }
                <li className='nav-text'>
                    <Button className='btn' onClick={logout}>
                    <span className='icon'><AiIcons.AiOutlineLogout /></span>
                    <span className='title'>Logout</span>
                    </Button>
                </li>
            </ul>
        </nav>
    </div>
  )
}

export default CNavbar