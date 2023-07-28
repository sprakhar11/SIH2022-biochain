import React from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { url } from '../../utilities';
import { Box, Button, FormControl, FormControlLabel, Checkbox, FormLabel, FormGroup, Grid, makeStyles, MenuItem, Paper, Select, Snackbar, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField, } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { FireFly } from '../../firefly';
import { SetProduct,AvailableProduct,SetCurrentProduct } from '../../actions';
import moment from 'moment';
import styles from './Depot.module.css';
import TrackProduct from '../TrackProduct';

const MEMBERS = [
  'http://localhost:5000',
  'http://localhost:5001',
];
const MAX_MESSAGES = 50;
const DATE_FORMAT = 'MM/DD/YYYY h:mm:ss A';

const DepotProduct=()=> {
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
     const d = productDetails.data.details;
     const [user, setUser] = useState({
       name: userData.name,
       deliveryaddress: userData.deliveryaddress,
      });
      const [messageText,setMessageText]=useState("Received");
      const firefly = useRef(null);
      const host = "http://localhost:5000";
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
            if(rows[row].data[0].value.details.productStatus=="fromBmu")
            {
              setBmu(true);
            }
            else if(rows[row].data[0].value.details.productStatus=="fromEpu")
            {
              setEpu(true);
            }
            else if(rows[row].data[0].value.details.productStatus=="AtDep"||rows[row].data[0].value.details.productStatus=="fromDepo")
            {
              console.log(rows[row].data[0].value.details.productStatus)
              setDep(true);
            }
            else if(rows[row].data[0].value.details.productStatus==("AtRef"||"fromRef"))
            {
              setRef(true);
            }
            else if(rows[row].data[0].value.details.productStatus=="AtRet")
            {
              setRet(true);
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
          <div className={`${styles.circle} mx-5 ${bmu?"bg-primary":""}`}>Biomass Unit</div>
        </div>
        <div>
          <div className={`${styles.circle} mx-5 ${epu?"bg-primary":""}`}>Ethanol Producer</div>
        </div>
        <div>
          <div className={`${styles.circle} mx-5 ${ref?"bg-primary":""}`}>Refinery</div>
        </div>
        <div>
          <div className={`${styles.circle} mx-5 ${dep?"bg-primary":""}`}>Depot</div>
        </div>
        <div>
          <div className={`${styles.circle} mx-5 ${ret?"bg-primary":""}`}>Retail Unit</div>
        </div>
      </div>)
    }

     const productReceieved = ()=>{
      setReceive("Received");
      dispatch(SetCurrentProduct(details));
      const bioeth = parseInt(availableProduct.ethanol,10) + parseInt(d.quantity1,10);
      // console.log(bioeth);
      const biopet = parseInt(availableProduct.petroleum,10) + parseInt(d.quantity2,10);
      // console.log(biopet);
      if(biopet>=4*bioeth)
      {
        const a = {
          bioethanol: parseInt(availableProduct.bioethanol,10)+ 5*parseInt(bioeth,10),
          ethanol:0,
          petroleum:parseInt(availableProduct.petroleum,10)-4*parseInt(bioeth,10),
          biodiesel:parseInt(availableProduct.biodiesel)
        }
        setAvailable(a);
        dispatch(AvailableProduct(a));
        console.log(a)
      }
      else{
        const a = {
          bioethanol:availableProduct.bioethanol+ biopet + biopet/4,
          ethanol:bioeth - biopet/4,
          petroleum:0,
          biodiesel:availableProduct.biodiesel
        }
        setAvailable(a);
        dispatch(AvailableProduct(a));
        console.log(a)
      }
     }
     const handleChange = (e) => {
      e.preventDefault();
      const name = e.target.name;
      const value = e.target.value;
  
      setDetails({ ...details, [name]: value });
    };
    useEffect(()=>{
      load();
    },[]);
      useEffect(() => {
        if (!userData.accessToken || userData.type!="Depot") {
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
        <div>DepotProduct</div>
        <ul class="list-group">
  <li class="list-group-item">Availability-<b>BIOETHANOL: {availableProduct.bioethanol},BIODIESEL: {availableProduct.biodiesel},ETHANOL: {availableProduct.ethanol},PETROLEUM: {availableProduct.petroleum}</b></li>
  <li class="list-group-item disabled">Order ID : {d.productId}</li>
  <li class="list-group-item">Sender: {d.senderType}-{d.sender}</li>
  <li class="list-group-item">Receiver: {d.receiverType}-{d.receiver}</li>
  {/* <li class="list-group-item">{d.product=="BIOETHANOL"?"Quantity-"d.quantity:}</li> */}
  <li class="list-group-item">Vestibulum at eros</li>
</ul>
<Paper className={`${classes.paper}${d.senderType=="Refinery"?"":"d-none"}`} component="form" onSubmit={async (event) => {
            event.preventDefault();
            try {
                if (messageText === '') {
                    return;
                }
                
                    setDetails({...details,messageText});
                    await firefly.current?.sendBroadcast([
                        {
                            
                            value: {details:details,messageText}
                        },
                    ]);
                
                setConfirmationMessage('Confirmation sent');
            }
            catch (err) {
                setConfirmationMessage(`Error: ${err}`);
            }
            setMessageText('');
        }}>

            {/* <FormControlLabel control={<Switch checked={!isPrivate} color="primary" onClick={() => setIsPrivate(!isPrivate)}/>} label={isPrivate
            ? 'Choose recipients'
            : 'Broadcast to the whole network'} className={`${classes.formControl} d-none`}/>
            {isPrivate && (<Box>
                <FormControl component="fieldset" className={classes.formControl}>
                  <FormLabel component="legend">Pick recipients</FormLabel>
                  <FormGroup>
                    {orgs.map((o, i) => (<FormControlLabel key={o.name} control={<Checkbox checked={!!pickedOrgs[o.name] || o.name === selfOrg} disabled={o.name === selfOrg} onChange={(e) => {
                        console.log(e.target);
                        setPickedOrgs({
                            ...pickedOrgs,
                            [e.target.value]: e.target.checked,
                        });
                    }} name={o.name} value={o.name}/>} label={o.name === selfOrg
                    ? `${o.name}/${o.identity} (self)`
                    : `${o.name}/${o.identity}`}/>))}
                  </FormGroup>
                </FormControl>
              </Box>)} */}
              <div className={`${d.productStatus=="AtDep"?"btn btn-success":"d-none"}`}>Received</div>
              <form className={`${receive=="Confirm Receipt"?"":"d-none"}${d.senderType=="Refinery"?"":"d-none"}`}>
                <div>
                  <input onChange={handleChange} type="number" name="weight1" value={details.weight1} placeholder="Ethanol Weight Receieved"/>
                </div>
                <div>
                  <input onChange={handleChange} type="number" name="weight2" value={details.weight2} placeholder="Petroleum Weight Receieved"/>
                </div>
              </form>
              <div>
                <div className={`${receive=="Confirm Receipt"?"d-none":""}`}>{details.weight1?details.weight1:setCurrentProduct.weight1}</div>
                <div className={`${receive=="Confirm Receipt"?"d-none":""}`}>{details.weight2?details.weight1:setCurrentProduct.weight2}</div>
              </div>

            <FormControl className={`${classes.formControl} d-none`} fullWidth={true}>
              <TextField label="Message" variant="outlined" value={messageText} onChange={(event) => setMessageText(event.target.value)}/>
            </FormControl>

            <FormControl className={classes.formControlRight}>
            <div>
    <button variant="contained" type='submit' className={`${d.senderType=="Refinery"?"":"d-none"} btn btn-warning`} onClick={productReceieved}>{receive}</button>
  </div>
            </FormControl>

            <div className={classes.clearFix}/>
          </Paper>
{/* <div>
    <button variant="contained" type='submit' className={`${d.senderType=="Refinery"?"":"d-none"} btn btn-warning`} onClick={productReceieved}>Confirm Receipt</button>
  </div> */}
  {/* <div>
    <TrackOrder />
  </div>
<div>
  
    <MessageList track = {track}/>
  
</div> */}
<div>
  <TrackProduct />
</div>
<div className={`${d.senderType=="Retail Unit"?"d-flex":"d-none"} space-betweeen`}>
  <div className={`${(d.product=="BIOETHANOL"&&d.quantity<=availableProduct.bioethanol)||(d.product=="BIODIESEL"&&d.quantity<=availableProduct.biodiesel)?"":"d-none"}`}>
  <Link className={`btn btn-primary`} to='/dep/sod'>Send Order</Link>
  </div>
  <div className='mx-5'>
    <Link className='btn btn-success' to='/dep/pod'>Place Order</Link>
    {/* <button onClick={()=>{console.log(productDetails.data.details.productId)}}>Place Order</button> */}
  </div>
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

export default DepotProduct;