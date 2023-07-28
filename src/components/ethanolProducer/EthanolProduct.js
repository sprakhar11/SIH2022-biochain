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

const EthanolProduct=()=> {
    const dispatch = useDispatch();
     let navigate = useNavigate();
     const [messages, setMessages] = useState([]);
     const [track,setTrack] = useState([]);
      const userData = useSelector((state) => state.UserDetails.userDetails);
      const availableProduct = useSelector((state)=>state.AvailableProduct.availableProduct);
      const productDetails = useSelector((state)=>state.SetProduct.setProduct);
      const allUsers = useSelector((state)=>state.AllUsers.allUsers);
      const d = productDetails.data.details;
     const[senderOrg,setSenderOrg] = useState({}); 
     const[receiverOrg,setReceiverOrg] = useState({});
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

        track.map((obj)=>{
          const time = obj.created;
          const id = obj.value.details.productId
          const sender = obj.value.details.sender;
          const receiver = obj.value.details.receiver;
          return(<div className='d-flex flex-column align-items-start my-3'>
          <div>Order ID: {id}</div>
            <div>Created at: {time}</div>
            <div className='d-flex align-items-center'>
              <div>Sender : </div>
              <div className='small mx-1'>{sender}</div>
            </div>
            
            <div className='d-flex align-items-center'>
            <div>Receiver :</div>
            <div className='small mx-1'>{receiver}</div>
            </div>
          </div>)
        })
      )

     }


    const setUserDetail = ()=>{
       for(const i in allUsers){
        if(allUsers[i].id==d.sender)
        {
          setSenderOrg(allUsers[i])
        }
        if(allUsers[i].id==d.receiver)
        {
          setReceiverOrg(allUsers[i])
        }
      }
     }
    useEffect(()=>{
      load();
      setUserDetail();
     
    },[]);
      useEffect(() => {
        if (!userData.accessToken || userData.type!="Ethanol Producer") {
          navigate('/login');
        }
        // else{
        //   load();
        // }
        // console.log(userData.accessToken);
        // console.log(config);
        // console.log(user);
      }, [userData, navigate]);

  return (
    <div>
        <div>EthanolProduct</div>
        <ul class="list-group">
        <li class="list-group-item">Availability-<b>ETHANOL: {availableProduct.ethanol}</b></li>
        <li class="list-group-item disabled">Order ID : {d.productId}</li>
  <li class="list-group-item disabled">Sender name : {senderOrg.name}</li>
  <li class="list-group-item">Sender: {d.senderType}-{d.sender}</li>
  <li class="list-group-item disabled">Receiver name : {receiverOrg.name}</li>
  <li class="list-group-item">Receiver: {d.receiverType}-{d.receiver}</li>
  {/* <li class="list-group-item">{d.product=="BIOETHANOL"?"Quantity-"d.quantity:}</li> */}
  <li class="list-group-item">Vestibulum at eros</li>
</ul>
<div className={`${d.productStatus=="AtRef"?"btn btn-success":"d-none"}`}>Reached at Refinery</div>
<div>
  
    {/* <MessageList track = {track}/> */}
    <TrackProduct />
  
</div>
<div className='d-flex space-betweeen'>
  <div className={`${d.productStatus!="AtRef"?"":"d-none"}`}>
  <Link className='btn btn-primary' to='/epu/sod'>Send Order</Link>
  </div>
</div>
    </div>
  )
}

export default EthanolProduct;