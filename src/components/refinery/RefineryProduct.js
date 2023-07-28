import React from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { url } from '../../utilities';
import { Link } from 'react-router-dom';
import { Box, Button, FormControl, FormControlLabel, Checkbox, FormLabel, FormGroup, Grid, makeStyles, MenuItem, Paper, Select, Snackbar, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField, } from '@material-ui/core';
import { FireFly } from '../../firefly';
import { SetProduct,AvailableProduct,SetCurrentProduct} from '../../actions';
import TrackProduct from '../TrackProduct';

const MEMBERS = [
  'http://localhost:5000',
  'http://localhost:5001',
];
const MAX_MESSAGES = 50;
const DATE_FORMAT = 'MM/DD/YYYY h:mm:ss A';

const RefineryProduct=()=> {
    const dispatch = useDispatch();
     let navigate = useNavigate();
     const [messages, setMessages] = useState([]);
     const [track,setTrack] = useState([]);
     const [receive, setReceive] = useState("Confirm Receipt");
     const [confirmationMessage, setConfirmationMessage] = useState('');
      const userData = useSelector((state) => state.UserDetails.userDetails);
      const productDetails = useSelector((state)=>state.SetProduct.setProduct);
      const [messageText,setMessageText]=useState("Received");
      const setCurrentProduct = useSelector((state)=>state.SetCurrentProduct.setCurrentProduct);
      const availableProduct = useSelector((state)=>state.AvailableProduct.availableProduct);
      const allUsers = useSelector((state)=>state.AllUsers.allUsers);
      const d = productDetails.data.details;
      const classes = useStyles();
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

    const [details, setDetails] = useState({
      productId: d.productId,
      product: d.product,
      quantity:d.quantity,
      weight:"",
      price:d.price,
      sender:userData._id,
      receiver:d.sender,
      senderType:userData.type,
      receiverType:d.senderType,
      senderName:userData.name,
      orderStatus: "AtRef",
      productStatus: "AtRef"
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
          }
        }
        setTrack(track);
        console.log(track);
    
    }

    const productReceieved = ()=>{
      setReceive("Received");
      dispatch(SetCurrentProduct(details));
      
     }
     const handleChange = (e) => {
      e.preventDefault();
      const name = e.target.name;
      const value = e.target.value;
  
      setDetails({ ...details, [name]: value });
    };

    const MessageList = (options)=>{
      const {track} = options;
      return(

        track.map((obj,i)=>{
          const time = obj.created;
          const id = obj.value.details.productId
          const sender = obj.value.details.sender;
          const receiver = obj.value.details.receiver;
          return(<div key={i} className='d-flex flex-column align-items-start my-3'>
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
        if (!userData.accessToken || userData.type!="Refinery") {
          navigate('/login');
        }
        // else{
        //   load();
        // }
        // console.log(userData.accessToken);
        // console.log(config);
        // console.log(user);
      }, [userData, navigate]);

      // const d = productDetails.data.details;
  return (
    <div>
        <div>Refinery Product</div>
        <ul class="list-group">
        <li class="list-group-item">Availability-<b>ETHANOL: {availableProduct.ethanol},PETROLEUM: {availableProduct.petroleum}</b></li>
  <li class="list-group-item disabled">Order ID : {d.productId}</li>
  <li class="list-group-item disabled">Sender name : {senderOrg.name}</li>
  <li class="list-group-item">Sender: {d.senderType}-{d.sender}</li>
  <li class="list-group-item disabled">Receiver name : {receiverOrg.name}</li>
  <li class="list-group-item">Receiver: {d.receiverType}-{d.receiver}</li>
  {/* <li class="list-group-item">{d.product=="BIOETHANOL"?"Quantity-"d.quantity:}</li> */}
</ul>

<Paper className={`${classes.paper}${d.senderType=="Ethanol Producer"||d.senderType=="Biomass Unit"?"":"d-none"}`} component="form" onSubmit={async (event) => {
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
              <div className={`${d.productStatus=="AtRef"?"btn btn-success":"d-none"}`}>Received</div>
              <form className={`${receive=="Confirm Receipt"?"":"d-none"}${d.senderType=="Ethanol Producer"|| d.senderType=="Biomass Unit"?"":"d-none"}`}>
                <div>
                  <input onChange={handleChange} type="number" name="weight" value={details.weight} placeholder="Ethanol Weight Receieved"/>
                </div>
              </form>
              <div>
                <div className={`${receive=="Confirm Receipt"?"d-none":""}`}>{details.weight?details.weight:setCurrentProduct.weight}</div>
               
              </div>

            <FormControl className={`${classes.formControl} d-none`} fullWidth={true}>
              <TextField label="Message" variant="outlined" value={messageText} onChange={(event) => setMessageText(event.target.value)}/>
            </FormControl>

            <FormControl className={classes.formControlRight}>
            <div>
    <button variant="contained" type='submit' className={`${d.senderType=="Ethanol Producer"||d.senderType=="Biomass Unit"?"":"d-none"} btn btn-warning`} onClick={productReceieved}>{receive}</button>
  </div>
            </FormControl>

            <div className={classes.clearFix}/>
          </Paper>
{/* <div>
  
    <MessageList track = {track}/>
  
</div> */}
<div>
  <TrackProduct />
</div>
<div className={`${d.senderType=="Depot"?"d-flex":"d-none"}`}>
  <div className={`${(d.product1=="ETHANOL"&&d.quantity1<=availableProduct.ethanol)||(d.product2=="PETROLEUM"&&d.quantity2<=availableProduct.petroleum)?"":"d-none"}`}>
  <Link className='btn btn-primary' to='/ref/sod'>Send Order</Link>
  </div>
  <div className='mx-5'>
    <Link className='btn btn-success' to='/ref/pod'>Place Order</Link>
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

export default RefineryProduct;