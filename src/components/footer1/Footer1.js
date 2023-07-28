import React from 'react'
import './Footer1.css'
import img1 from '../assets/purses.png'
import icon from '../assets/Icon.png'


export default function 
() {
  return (
    <div> <div className="purse">
    <div className="img">
               <img src={img1} alt="BIOCHAIN" />
   
    </div>
    <div className="pursetext">
       <p>Know How A Large Organization can revamp Its Supply Chain And Logistics Operations Using Biochain</p>
       <button  className="button"> ⬇ Download Product</button>
    </div>
   
   
         </div>
   

   <p className="pp" >The 6 Steps To Peak Performance</p>
        
<div className="boxes">

<div className="box">
<div className="icon">
    <img src={icon}  alt="features" />
</div>
<div className="head"> <p>Decentralised System</p> </div>
<div className="para"> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sagittis hendrerit integer mattis enim. Aliquet aliquam faucibus accumsan at in. Vitae non fames faucibus amet ridiculus habitasse.</p> </div>
</div>
<div className="box">
<div className="icon">
    <img src={icon}  alt="features" />
</div>
<div className="head"> <p>Real - Time Tracking</p> </div>
<div className="para"> <p>In logistics, order visibility and time are of utmost importance. Ai eliminate long service queues and share a real-time status of the order to the customers.</p> </div>
</div>
<div className="box">
<div className="icon">
    <img src={icon}  alt="features" />
</div>
<div className="head"> <p>Customer Relationship</p> </div>
<div className="para"> <p>Easy navigation, reduced waiting time and real-time information in a conversational manner result in an enhanced customer experience and thus improved customer relationships.</p> </div>
</div>


</div>
<div className="boxes">

<div className="box">
<div className="icon">
    <img src={icon}  alt="features" />
</div>
<div className="head"> <p>24/7 Support</p> </div>
<div className="para"> <p>In logistics, order visibility and time are of utmost importance. Biochain eliminate long service queues and share a real-time status of the order to the customers.</p> </div>
</div>
<div className="box">
<div className="icon">
    <img src={icon}  alt="features" />
</div>
<div className="head"> <p>Conversational Interface</p> </div>
<div className="para"> <p>Biochain get the users rid of complex UI and engage with them in a human-like contextual conversation. Therefore the users get personalized responses to their queries.</p> </div>
</div>
<div className="box">
<div className="icon">
    <img src={icon}  alt="features" />
</div>
<div className="head"> <p>Machine Learning</p> </div>
<div className="para"> <p>Biochain use advanced machine learning in the supply chain. They grow smarter with each interaction and thus the operations continue to become more efficient over time.</p> </div>
</div>


</div>

    </div>
  )
}
