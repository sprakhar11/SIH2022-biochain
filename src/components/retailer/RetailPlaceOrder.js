import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { url } from '../../utilities';
import { Box, Button, FormControl, FormControlLabel, Checkbox, FormLabel, FormGroup, Grid, makeStyles, MenuItem, Paper, Select, Snackbar, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField, } from '@material-ui/core';
import { useCallback,useRef} from 'react';
import { FireFly, } from '../../firefly';
import ReconnectingWebsocket from 'reconnecting-websocket';
import dayjs from 'dayjs';
import uuid from 'react-uuid';
import { SetProduct,AvailableProduct } from '../../actions';

const MEMBERS = [
    'http://localhost:5000',
    'http://localhost:5001',
];

const MAX_MESSAGES = 50;
const DATE_FORMAT = 'MM/DD/YYYY h:mm:ss A';

const RetailPlaceOrder=()=> {

    // const additionalDetails = useSelector(
    //     (state) => state.AdditionalDetails.additionalDetails
    //   );
    const dispatch = useDispatch();
     let navigate = useNavigate();
      const userData = useSelector((state) => state.UserDetails.userDetails);
      const [user, setUser] = useState({
        name: userData.name,
        deliveryaddress: userData.deliveryaddress,
      });

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.accessToken}`,
        },
      };
    //   const [pid,setPid] = useState('');
      const [rate,setRate] = useState(63.45);
      const [details, setDetails] = useState({
        productId: uuid(),
        product: "BIOETHANOL",
        productType:"",
        quantity:"",
        weight:"",
        availableEth:"",
        availableDsl:"",
        price:0,
        sender:userData._id,
        receiver:"",
        senderType:userData.type,
        receiverType:"Depot",
        senderName:userData.name,
        orderStatus: "fromRet",
        productStatus: ""
   })
   const handleChange = (e) => {
       e.preventDefault();
       const name = e.target.name;
       const value = e.target.value;
   
       setDetails({ ...details, [name]: value });
     };
   const classes = useStyles();
   const [products, setProducts] = useState([]);
   const [receiverId, setReceiverId] = useState("");
   const [messages, setMessages] = useState([]);
   const [messageText, setMessageText] = useState(userData.deliveryaddress);
   const [selectedMember, setSelectedMember] = useState(0);
   const firefly = useRef(null);
   const ws = useRef(null);
   const [isPrivate, setIsPrivate] = useState(false);
   const [orgs, setOrgs] = useState([]);
   const [pickedOrgs, setPickedOrgs] = useState({});
   const [selfOrg, setSelfOrg] = useState('');
   const [confirmationMessage, setConfirmationMessage] = useState('');
   const allUsers = useSelector((state)=>state.AllUsers.allUsers);
   const arr = [];
   const load = useCallback(async () => {
       const host = MEMBERS[selectedMember];
       console.log(`Loading data from ${host}`);
       firefly.current = new FireFly(host);
       const messages = await firefly.current.getMessages(MAX_MESSAGES);
       const rows = [];
       for (const message of messages) {
           rows.push({
               message,
               data: await firefly.current.retrieveData(message.data),
           });
       }
       setMessages(rows);
       const orgs = await firefly.current.getOrgs();
       setOrgs(orgs);
       const status = await firefly.current.getStatus();
       setSelfOrg(status?.org?.name || '');
       const wsHost = MEMBERS[selectedMember].replace('http', 'ws');
       if (ws.current !== null) {
           ws.current.close();
       }
       ws.current = new ReconnectingWebsocket(`${wsHost}/ws?namespace=default&ephemeral&autoack`);
       ws.current.onopen = () => {
           console.log('Websocket connected');
       };
       ws.current.onmessage = (message) => {
           const data = JSON.parse(message.data);
           if (data.type === 'message_confirmed') {
               load();
           }
       };
       ws.current.onerror = (err) => {
           console.error(err);
       };
   }, [selectedMember]);
   const orgName = (message) => {
       const identity = message.message.header.author;
       const org = orgs?.find((o) => o.identity === identity);
       let name = org ? org.name : identity;
       if (message.message.local) {
           name = `${name} (self)`;
       }
       return name;
   };
  

   useEffect(() => {
     if (!userData.accessToken || userData.type!="Retail Unit") {
       navigate('/login');
     }
   }, [userData, navigate]);
   
   useEffect(() => {
       load();
       console.log(details);
   }, [load]);
   
   useEffect(()=>{
    if(details.product=="BIODIESEL")
    {
        setRate(77);
        details.price = details.quantity*rate;
    }
    else{
        setRate(63.45);
        details.price=details.quantity*rate;
    }
   })
  return (
    <div className={`${classes.root} d-flex flex-column align-items-center`}>

        <div>{details.senderType}: {userData.name}</div>
        <div>{details.sender}</div>
        <div>Order ID: <span className='text-danger'>{details.productId}</span></div>

        <form className="" style={{width:"80%"}} noValidate>

          <div className='form-row'>
          <div className='field mb-4' id='product'>
          
          <select
            className={`p-2 border-none`}
            name='product'
            value={details.product}
            onChange={handleChange}
          >
            <option>BIOETHANOL</option>
            <option>BIODIESEL</option>
          </select>
          {/* <input
            type='text'
            placeholder='Type your answer here...'
            name='product'
            value={details.product}
            onChange={handleChange}
          /> */}
        </div>
          </div>
     <div className='form-row'>
      <div className='col-md-1'>{details.product}</div>
     </div>
  <div className="form-row">
    <div className="col-md-3 mb-3">
      <input type="number" name='quantity' value={details.quantity} onChange={handleChange} className="form-control ip" id="quantity" placeholder="Volume(L)" required />
      <div className="valid-tooltip">
        Looks good!
      </div>
    </div>
   
    {/* <div className="col-md-3 mb-3">
     
      <input type="number" name='weight' onChange={handleChange} className="form-control ip" id="validationTooltip02" placeholder="Weight(KG)" value={details.weight} required />
      <div className="valid-tooltip">
        Looks good!
      </div>
    </div> */}
    <div className='mx-3'>
    Rate: {rate} /L
    </div>
    <div>
    Price: {rate*details.quantity} INR
    </div>
  </div>


  <div className='form-row'>

  <div className="col-md-4 my-3">
      <select className='custom-select'  name="receiver" onChange={(e)=>{
        const selectedId = e.target.value;
        setReceiverId(selectedId);
        setDetails({ ...details, [e.target.name]: e.target.value });
        console.log(details.receiver);
      }}>
        <option value="">Select</option>
        {
          allUsers.map((d,i)=>{
            if(d.type=="Depot")
            {
              return(
                <option key={i} value = {d.id}>{d.name}</option>
              )
            }
          })
        }
      </select>
      
    </div>
    {/* <div>{receiverId} : ;</div>
    <div>{details.receiver}</div> */}
 <div className="col-md-4 my-3">
      <input type="text" name='receiver' value={details.receiver} onChange={handleChange} className="form-control ip" id="receiver" placeholder="Depot ID" required />
      <div className="valid-tooltip">
        Looks good!
      </div>
    </div>
 </div>

   <div className='text-left my-3 mb-4 ip p-2 rounded' style={{width:"50%"}}>
    <div>Delivery Address: </div>
    <div>{userData.deliveryaddress}</div>
   </div>
  <div className="form-row align-left  p-1 rounded" style={{width:"70%"}}>
    <div className="col-md-3 mb-3 text-left">
    City: <span className=''>Noida</span>
    </div>
    <div className="col-md-3 mb-3 text-left">
    State: <span className=''>Uttar Pradesh</span>
    </div>
    <div className="col-md-3 mb-3 text-left">
    Pincode: <span className=''>201301</span>
    </div>
  </div>

  {/* <div className='field' id='receiver'>
          <label className='question  mx-5 my-2'>
            Refinery ID <span className='mandatory'>*</span>
          </label>
          <input
            type='text'
            placeholder='Type your answer here...'
            name='receiver'
            value={details.receiver}
            onChange={handleChange}
          />
        </div> */}
  {/* <button className="btn btn-primary" type="submit">Submit form</button> */}
</form>

       
      <Grid container spacing={3}>
        <Grid item xs={1} md={2} xl={3}/>
        <Grid item xs={10} md={8} xl={6}>
          <Paper className={classes.paper} component="form" onSubmit={async (event) => {
            event.preventDefault();
            try {
                if (messageText === '') {
                    return;
                }
                if (isPrivate) {
                    const recipients = [];
                    pickedOrgs[selfOrg] = true;
                    for (const oName in pickedOrgs) {
                        if (pickedOrgs[oName]) {
                            recipients.push({ identity: oName });
                        }
                    }
                    await firefly.current?.sendPrivate({
                        data: [
                            {
                                value: messageText,
                            },
                        ],
                        group: {
                            members: recipients,
                        },
                    });
                }
                else {
                    setDetails({...details,messageText});
                    await firefly.current?.sendBroadcast([
                        {
                            
                            value: {details:details,messageText}
                        },
                    ]);
                }
                setConfirmationMessage('Order sent');
            }
            catch (err) {
                setConfirmationMessage(`Error: ${err}`);
            }
            setMessageText('');
        }}>

            <FormControlLabel control={<Switch checked={!isPrivate} color="primary" onClick={() => setIsPrivate(!isPrivate)}/>} label={isPrivate
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
              </Box>)}

            <FormControl className={`${classes.formControl} d-none`} fullWidth={true}>
              <TextField label="Message" variant="outlined" value={messageText} onChange={(event) => setMessageText(event.target.value)}/>
            </FormControl>

            <FormControl >
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </FormControl>

            <div className={classes.clearFix}/>
          </Paper>

          <br />

          {/* <Paper className={classes.paper}>
            <h1>Last {MAX_MESSAGES} Messages Received</h1>

            <MessageList messages={messages}/>
          </Paper> */}
        </Grid>
        <Grid item xs={1} md={2} xl={3}>
          <FormControl style={{ float: 'right',visibility:"hidden"}}>
            <Select value={selectedMember} onChange={(event) => {
            console.log(`Set selected member ${event.target.value}`);
            setSelectedMember(event.target.value);
        }}>
              {MEMBERS.map((m, i) => (<MenuItem key={m} value={i}>
                  {m}
                </MenuItem>))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs/>
      </Grid>
      {/* <Product val = {products} /> */}
      <Snackbar anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }} open={!!confirmationMessage} autoHideDuration={3000} message={confirmationMessage} onClose={() => setConfirmationMessage('')}/>
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

export default RetailPlaceOrder;