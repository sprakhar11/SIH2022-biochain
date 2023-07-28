import React from 'react';
import './Cover.css';
import img from '../assets/coverimg.png';
import img1 from '../assets/purses.png';

export default function Cover() {
  return (
    <div>
      <div className="cover">
        <img src={img} alt="BIOCHAIN" />
      </div>
      <div className="cc">
        <div className="coverp">
          <p>Logistics through innovation, dedication, and technology.</p>
        </div>
        <div className="coverp1">
          <p>Made with ❤️ in 🇮🇳 </p>
        </div>
      </div>
     

    </div>
  );
}
