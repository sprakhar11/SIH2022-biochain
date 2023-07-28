import React from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { url } from '../../utilities';
import { Link } from 'react-router-dom';
import { FireFly } from '../../firefly';
import { SetProduct,AvailableProduct } from '../../actions';
import TrackProduct from '../TrackProduct';

const MEMBERS = [
  'http://localhost:5000',
  'http://localhost:5001',
];
const MAX_MESSAGES = 50;
const DATE_FORMAT = 'MM/DD/YYYY h:mm:ss A';

const BiomassProduct=()=> {
    const dispatch = useDispatch();
     let navigate = useNavigate();
     const [messages, setMessages] = useState([]);
     const [track,setTrack] = useState([]);
      const userData = useSelector((state) => state.UserDetails.userDetails);
      const availableProduct = useSelector((state)=>state.AvailableProduct.availableProduct);
      const productDetails = useSelector((state)=>state.SetProduct.setProduct);
      const [user, setUser] = useState({
        name: userData.name,
        deliveryaddress: userData.deliveryaddress,
      });
      const firefly = useRef(null);
      const host = "http://localhost:5000";
    const userBlockchainDetails = useSelector((state)=>state.UserBlockchainDetails.userBlockchainDetails)
    console.log(userBlockchainDetails);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.accessToken}`,
        },
      };
      const load= async()=>{
        const track = [];
        firefly.current = new FireFly(host);
        const messages = await firefly.current.getMessages(MAX_MESSAGES);
          const rows = [];
          for (const message of messages) {
            // rows.push({
            //     message,
            //     data: await firefly.current.retrieveData(message.data),
            // });
            // const obj = await axios.get(`http://127.0.0.1:5000/api/v1/namespaces/default/messages/${message.header.id}/data`).then((res)=>{
            //     return res.data[0].value;
            // })
            console.log("load:",message);
            rows.push({
              message,
              data: await firefly.current.retrieveData(message.data),
          });
        }
        for(const row in rows)
        {
          // console.log("row: ",rows[row])
          const pid = rows[row].data[0].value.details.productId;
          const d = productDetails.data.details;
          if(pid==d.productId)
          {
            console.log("row: ",rows[row].data[0].value.details.productId)
            track.push(rows[row].data[0]);
          }
        }
        setTrack(track);
        console.log(track);
    
    }
    const MessageList = (options)=>{
      const {track} = options;
      return(

        track.map((obj,i)=>{
          const time = obj.created;
          const id = obj.value.details.productId
          const sender = obj.value.details.sender;
          const receiver = obj.value.details.receiver;
          return(<div key={i} className='d-flex flex-column align-items-start my-3'>
            <div>ID: {id}</div>
            <div>Created at: {time}</div>
            <div>Sender: {sender}</div>
            <div>Receiver: {receiver}</div>
          </div>)
        })
      )

     }
    useEffect(()=>{
      load();
    },[]);
      useEffect(() => {
        if (!userData.accessToken || userData.type!="Biomass Unit") {
          navigate('/login');
        }
        // else{
        //   load();
        // }
        // console.log(userData.accessToken);
        // console.log(config);
        // console.log(user);
      }, [userData, navigate]);

      const d = productDetails.data.details;
  return (
    <div>
        <div>Biomass Product</div>
        <ul class="list-group">
        <li class="list-group-item">Availability-<b>ETHANOL: {availableProduct.ethanol}</b></li>
  <li class="list-group-item disabled">Order ID : {d.productId}</li>
  <li class="list-group-item">Sender: {d.senderType}-{d.sender}</li>
  <li class="list-group-item">Receiver: {d.receiverType}-{d.receiver}</li>
  {/* <li class="list-group-item">{d.product=="BIOETHANOL"?"Quantity-"d.quantity:}</li> */}
  <li class="list-group-item">Vestibulum at eros</li>
</ul>
<div>
  
    {/* <MessageList track = {track}/> */}
    <TrackProduct />
  
</div>
<div className='d-flex space-betweeen'>
  <div>
  <Link className='btn btn-primary' to='/bmu/sod'>Send Order</Link>
  </div>
</div>
    </div>
  )
}

export default BiomassProduct;