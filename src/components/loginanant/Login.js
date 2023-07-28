import React from 'react'
import './Login.css'
import img1 from '../assets/gradient.png'
import img2 from '../assets/loginbg.png'
import logo from '../assets/logo.png'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserDetails, AddDetails } from '../../actions/index';
import { url } from '../../utilities';

function Login() {
    let navigate = useNavigate();
    // const [sendElement, setSendElement] = useState('');
    //   const url = 'https://onerecruit.herokuapp.com';
    //   const additionalDetails = useSelector(state=>state.AdditionalDetails.additionalDetails)
    const userData = useSelector((state) => state.UserDetails.userDetails);
    const senderType = userData.type;
    useEffect(() => {
      if (userData.accessToken) {
        console.log(senderType);
        switch(senderType)
        {
          case "Ethanol Producer":{navigate("/epu");break;}
          case "Biomass Unit":{navigate("/bmu");break;}
          case "Refinery":{navigate("/ref");break;}
          case "Depot":{navigate("/dep");break;}
          case "Retail Unit":{navigate("/rtl");break;}
          // default:navigate('/myprofile');
        }
        
      }
      // elements.map((element) => {
      //   if (element.type == 'home') {
      //     setSendElement(element.body);
      //   }
      // });
      // eslint-disable-next-line
    }, []);
    let dispatch = useDispatch();
    const [user, setUser] = useState({
      email: '',
      password: '',
    });
  
    //   const localData = localStorage.getItem('userinfo');
    //   const userInfo = localData ? JSON.parse(localData) : null;
  
    const handleSubmit = async (e) => {
      const { email, password } = user;
      e.preventDefault();
      try {
        const res = await axios.post(`${url}/api/auth/login`, {
          email,
          password,
        });
        //   setUser(res.data);
        console.log(res.data);
        if (res) {
          // const user = res.data;
          dispatch(UserDetails(res.data));
          dispatch(AddDetails(res.data.additionalDetails));
  
          // localStorage.setItem('userinfo', JSON.stringify(res.data));
          console.log('response present');
          console.log('redux data', userData);
          if (res.data.accessToken) {
            switch(senderType)
        {
          case "Ethanol Producer":{navigate("/epu");break;}
          case "Biomass Unit":{navigate("/bmu");break;}
          case "Refinery":{navigate("/ref");break;}
          case "Depot":{navigate("/dep");break;}
          case "Retail Unit":{navigate("/rtl");break;}
          // default:navigate('/myprofile');
        }
            // navigate('/myprofile', { replace: true });
          } else {
            alert('wrong credentials');
          }
        } else {
          if (res) {
            console.log('data');
          } else {
            console.log('Network error');
          }
        }
      } catch (error) {
        console.log(error);
      }
      // console.log(user);
    };
  
    const handleChange = (e) => {
      e.preventDefault();
      const name = e.target.name;
      const value = e.target.value;
      setUser({ ...user, [name]: value });
    };
  return (

    <div className="main">
    <div className="logo">
       <div className="img"> <img src={logo} alt="" /></div>
       <div className="text">BioChain</div>
    </div>
    <div className='login'>
        <div className="left">
         <img src={img2} alt="Login" />

        </div>
        <div className="right">
            <p className="head">Sign In</p>
            <p className="subhead">Login to your existing Biochain Account</p>
            <div className="fields">

            <form
            onSubmit={handleSubmit}
            className='form'
          >
            <div className='mail'>
                <label for="email" >Email</label> 
              <input
                className='mail1'
                type='email'
                name='email'
                value={user.email}
                placeholder='Admin@biochain.com'
                onChange={handleChange}
              />
            </div>
            <div className='password'>
                <label for="password">Password</label> 
              <input
                className='password1'
                type='password'
                name='password'
                value={user.password}
                placeholder='Enter your Password'
                onChange={handleChange}
              />
            </div>
            <button className='loginbtn' type='submit'>
              Log in
            </button>
           

            {/* <Link
              to='/register'
              className={`m-3 btn btn-light border-dark text-decoration-none w-50 ${styles.btnRegister}`}
              type=''
            >
              Register Now
            </Link> */}
          </form>

            </div>
            <div className='end'>Not signed up yet? <span className='end1'><Link to='/register' className='end1'>SignUp</Link></span> </div> 
        </div>

    </div>
    </div>
  )
}

export default Login