import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import img1 from '../assets/sih.png';
import img2 from '../assets/b.png';
import './Footer.css';

function Footer() {
  let navigate = useNavigate();
  return <div className="footer">Footer</div>;
}

export default Footer;
