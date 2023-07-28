import React from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { url } from '../utilities';
import { Box, Button, FormControl, FormControlLabel, Checkbox, FormLabel, FormGroup, Grid, makeStyles, MenuItem, Paper, Select, Snackbar, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField, } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { FireFly } from '../firefly';
import { SetProduct,AvailableProduct,SetCurrentProduct } from '../actions';
import moment from 'moment';
import styles from './TrackProduct.module.css';



const MAX_MESSAGES = 50;
const DATE_FORMAT = 'MM/DD/YYYY h:mm:ss A';

const TrackProduct=()=> {
    const dispatch = useDispatch();
     let navigate = useNavigate();
     const [bmu,setBmu] = useState(false);
     const [epu,setEpu] = useState(false);
     const [ref, setRef] = useState(false);
     const [dep,setDep] = useState(false);
     const [ret,setRet] = useState(false);
     const [receive, setReceive] = useState("Confirm Receipt");
     const [messages, setMessages] = useState([]);
     const [confirmationMessage, setConfirmationMessage] = useState('');
     const [track,setTrack] = useState([]);
     const userData = useSelector((state) => state.UserDetails.userDetails);
     const productDetails = useSelector((state)=>state.SetProduct.setProduct);
     const setCurrentProduct = useSelector((state)=>state.SetCurrentProduct.setCurrentProduct);
     const availableProduct = useSelector((state)=>state.AvailableProduct.availableProduct);
     const [available, setAvailable] = useState(availableProduct);
     const classes = useStyles();
    //  const [status,setStatus] = useState({
    //   fromEpu:"",
    //   fromBmu:"",
    //   AtRef:"",
    //   fromRef:"",
    //   Atdep:"",
    //   fromDepo:"",
    //   AtRet:"",
    //  })
     const [fromEpu,setFromEpu] = useState("");
     const [fromBmu,setFromBmu] = useState("");
     const [AtRef, setAtRef] = useState("");
     const [fromRef,setFromRef]= useState("");
     const [AtDep, setAtDep] = useState("");
     const [fromDepo, setFromDepo] = useState('');
     const [AtRet,setAtRet] = useState("");
     const d = productDetails.data.details;
     const [user, setUser] = useState({
       name: userData.name,
       deliveryaddress: userData.deliveryaddress,
      });
      const [messageText,setMessageText]=useState("Received");
      const firefly = useRef(null);
      const host = "http://localhost:5000"
    const userBlockchainDetails = useSelector((state)=>state.UserBlockchainDetails.userBlockchainDetails)
    console.log(userBlockchainDetails);


    const [details, setDetails] = useState({
      productId: d.productId,
      product1: d.product1,
      product2:d.product2,
      quantity1:d.quantity1,
      weight1:"",
      quantity2:d.quantity2,
      weight2:"",
      price1:d.price1,
      price2:d.price2,
      sender:userData._id,
      receiver:d.sender,
      senderType:userData.type,
      receiverType:"Refinery",
      senderName:userData.name,
      orderStatus: "AtDep",
      productStatus: "AtDep"
 })

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
          console.log("rows:",rows)
          // console.log("status",status)
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
            const time = moment(rows[row].message.confirmed).utc().format('DD-MM-YYYY');
            const t =moment(rows[row].message.confirmed).format('hh:mm:ss')
            // moment(obj.created).utc().format('DD-MM-YYYY');
            console.log(time);
            const r =rows[row].data[0].value.details;
            if(r.productStatus=="fromBmu")
            {
              setBmu(true);
              setFromBmu(`${time}/${t}`);
            }
            else if(r.productStatus=="fromEpu")
            {
              setEpu(true);
              setFromEpu(`${time}/${t}`)
            }
            else if(r.productStatus=="AtDep"||r.productStatus=="fromDepo")
            {
              console.log(r.productStatus)
              setDep(true);
              if(r.productStatus=="AtDep")
              {
                setAtDep(`${time}/${t}`);
              }
              if(r.productStatus=="fromDepo")
              {
                setFromDepo(`${time}/${t}`);
              }

            }
            else if(r.productStatus==("AtRef"||"fromRef"))
            {
              setRef(true);
              if(r.productStatus=="AtRef")
              {
                setAtRef(`${time}/${t}`);
              }
              if(r.productStatus=="fromRef")
              {
                setFromRef(`${time}/${t}`);
              }
            }
            else if(r.productStatus=="AtRet")
            {
              setRet(true);
              setAtRet(`${time}/${t}`);
            }
          }
        }
        setTrack(track);
        console.log(track);
    
    }
    const MessageList = (options)=>{
      const {track} = options;
      return(

        track.map((obj,i)=>{
          const time = moment(obj.created).utc().format('DD-MM-YYYY');
          // moment(obj.created).utc().format('DD-MM-YYYY')
          // const x = obj.details.value
          const id = obj.value.details.productId
          const sender = obj.value.details.sender;
          const receiver = obj.value.details.receiver;
          const orderStatus = obj.value.details.orderStatus;
          const productStatus=obj.value.details.productStatus;
          return(<div key={i} className='d-flex flex-column align-items-start my-3'>
            <div>ID: {id}</div>
            <div>Created at: {time}/{moment(obj.created).format('hh:mm:ss')}</div>
            <div>Order Status: {orderStatus}</div>
            <div>Product Status: {productStatus}</div>
            <div>Sender: {sender}</div>
            <div>Receiver: {receiver}</div>
          </div>)
        })
      )
     
     }

    const TrackOrder = ()=>{
      return(<div className='m-3 d-flex'>
        <div>
          <div>
          <div className={`${styles.circle} mx-5 ${bmu?"bg-primary":""}`}>Biomass Unit</div>
          <div>{fromBmu}</div>
          </div>
        </div>
        <div>
          <div className={`${styles.circle} mx-5 ${epu?"bg-primary":""}`}>Ethanol Producer</div>
          <div>{fromEpu}</div>
        </div>
        <div>
          <div>{AtRef}</div>
          <div className={`${styles.circle} mx-5 ${ref?"bg-primary":""}`}>Refinery</div>
          <div>{fromRef}</div>
        </div>
        <div>
          <div>{AtDep}</div>
          <div className={`${styles.circle} mx-5 ${dep?"bg-primary":""}`}>Depot</div>
          <div>{fromDepo}</div>
        </div>
        <div>
          <div>{AtRet}</div>
          <div className={`${styles.circle} mx-5 ${ret?"bg-primary":""}`}>Retail Unit</div>
        </div>
      </div>)
    }

     
    useEffect(()=>{
      load();
    },[]);
      

  return (
    <div>

{/* <div>
    <button variant="contained" type='submit' className={`${d.senderType=="Refinery"?"":"d-none"} btn btn-warning`} onClick={productReceieved}>Confirm Receipt</button>
  </div> */}
  <div>
    <TrackOrder />
  </div>
<div>
  
    <MessageList track = {track}/>
  
</div>
 
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
      padding: theme.spacing(2),
  },
  paper: {
      padding: theme.spacing(2),
  },
  formControl: {
      marginTop: theme.spacing(2),
  },
  formControlRight: {
      marginTop: theme.spacing(2),
      float: 'right',
  },
  selectEmpty: {
      marginTop: theme.spacing(2),
  },
  upload: {
      display: 'none',
  },
  clearFix: {
      clear: 'both',
  },
  scrollRight: {
      overflowX: 'scroll',
      [theme.breakpoints.up('xs')]: {
          maxWidth: 150,
      },
      [theme.breakpoints.up('md')]: {
          maxWidth: 350,
      },
      [theme.breakpoints.up('xl')]: {
          maxWidth: 450,
      },
  },
}));

export default TrackProduct;