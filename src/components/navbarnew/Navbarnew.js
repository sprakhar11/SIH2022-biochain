import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';

function Navbarnew() {
  let navigate = useNavigate();
  return (
    <div>
      <div className="navbar">
        <div className="logo">
          <img src={logo} alt="BIOCHAIN" />
          <span>Biochain</span>
        </div>
        <div className="menu">
 <ul>
  <li>Home</li>
  <li>Feaures</li>
  <li>What we do</li>
  <Link to='/login'><li> <button  className="button">Login/Signup</button> </li></Link>
  
 </ul>

        </div>
      </div>
    </div>
  );
}

export default Navbarnew;
