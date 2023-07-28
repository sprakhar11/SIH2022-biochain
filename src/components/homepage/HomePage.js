import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import Navbar from '../navbar/Navbar';
import Navbarnew from '../navbarnew/Navbarnew';
import Footer1 from '../footer1/Footer1';
import Cover from '../cover/Cover';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from '../loginanant/Login';
import Footer from '../footer/Footer';
// import { elements } from '../links/links';
// import axios from 'axios';

const HomePage = () => {
  let navigate = useNavigate();
  // const additionalDetails = useSelector(
  //   (state) => state.AdditionalDetails.additionalDetails
  // );
  const userData = useSelector((state) => state.UserDetails.userDetails);

  // const logout = async () => {
  //   try {
  //     const res = await axios.post(`/api/auth/logout`);
  //     if (res) {
  //       console.log(res.data);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   additionalDetails = {};
  //   userData = {};
  // };
  // let sendElement;
  // useEffect(() => {
  //   if (!userData.accessToken) {
  //     navigate('/');
  //   }

  //   // elements.map((element, i) => {
  //   //   if (element.type == 'login') {
  //   //     sendElement = element.body;
  //   //   }
  //   // });
  //   // console.log(elements);
  //   // eslint-disable-next-line
  // }, []);

  return (
    <div>

      <Navbarnew />
      <Cover />
      <Footer1 />
      <Footer />
      {/* <Login /> */}

      {/* <Navbar
        element={
          <Link
            className={`mx-2 text-dark text-decoration-none btn border-dark bg-none`}
            to='/login'
          >
            Login
          </Link>
        }
      />
      <div
        className={`container my-4 ${styles.homeContainer} d-flex flex-column align-items-center`}
      >
        <div className={`h1 ${styles.heading} text-center`}>
          Register to this <br></br> biofuels supply chain site.
        </div>
        <div
          className={`${
            (styles.lightText, styles.extraText)
          } text-center m-2 mb-4`}
        >
          Made with ❤ 404 solvers
        </div>
        <div className='d-flex justify-content center'>
          <div className='m-2'>
            <Link to='/login'>Login</Link>
          </div>
          <div className='m-2'>
            <Link to='/register'>Register</Link>
          </div>
          <div className='m-2'>
            <Link to='/myprofile'>Profile</Link>
          </div>
          
        <div
          className={`d-flex justify-content-center w-50 ${styles.btnContainer}`}
        >
          <Link
            to='/register'
            className={`m-3 btn btn-dark text-decoration-none w-50 ${styles.btnRegister}`}
            type=''
          >
            Register Now
          </Link>
        </div>
      </div> */}
    </div>
  );
};

export default HomePage;