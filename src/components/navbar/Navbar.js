import React from 'react';
// import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar(props) {
  const element = props.element;
  const logout = props.logout ? props.logout : '';
  return (
    <div>
      <div className={`navbar px-5 py-3`}>
        <div className={`px-5 mx-1 h3 ${styles.navbarTitle}`}>ProductName</div>
        <div className={`px-3`}>
          <ul className={`w-100 d-flex space-between`}>
            {element}
            {logout}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
// {`w-100 d-flex justify-content-center bg-dark`}
