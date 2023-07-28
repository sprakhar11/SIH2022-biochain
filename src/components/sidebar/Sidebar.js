import React from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import './Sidebar.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {SidebarStatus} from '../../actions';

// ()=>{
//   dispatch(SidebarStatus(state));
// }
function Sidebar() {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [state, setState] = useState("Dashboard");
   const userData = useSelector((state) => state.UserDetails.userDetails);

  return (
    <div>Sidebar</div>
  )
}

export default Sidebar