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

const RefinerySendOrder=()=> {

    // const additionalDetails = useSelector(
    //     (state) => state.AdditionalDetails.additionalDetails
    //   );
    const dispatch = useDispatch();
     let navigate = useNavigate();
     const productDetails = useSelector((state)=>state.SetProduct.setProduct);
      const userData = useSelector((state) => state.UserDetails.userDetails);
      const d = productDetails.data.details;
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
      const rate1 = 63.45;
      const rate2 = 96;
      const [details, setDetails] = useState({
        productId: productDetails?productDetails.data.details.productId:uuid(),
        product1: "ETHANOL",
        product2:"PETROLEUM",
        quantity1:d.quantity1,
        weight1:"",
        quantity2:d.quantity2,
        weight2:"",
        price1:0,
        price2:0,
        sender:userData._id,
        receiver:d.sender,
        senderType:userData.type,
        receiverType:"Depot",
        senderName:userData.name,
        orderStatus: "fromRef",
        productStatus: "fromRef"
   })
   const handleChange = (e) => {
       e.preventDefault();
       const name = e.target.name;
       const value = e.target.value;
   
       setDetails({ ...details, [name]: value });
     };
   const classes = useStyles();
   const [products, setProducts] = useState([]);
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
     if (!userData.accessToken || userData.type!="Refinery") {
       navigate('/login');
     }
   }, [userData, navigate]);
   
   useEffect(() => {
       load();
       console.log(details);
   }, [load]);
   
  return (
    <div className={`${classes.root} d-flex flex-column align-items-center`}>
      {/* <button onClick={()=>{console.log(productDetails.data.details.productId)}}>Place Order</button> */}

        <div>{details.senderType}: {userData.name}</div>
        <div>{details.sender}</div>
        <div>Order ID: <span className='text-danger'>{details.productId}</span></div>

        <form className="" style={{width:"80%"}} noValidate>
     <div className='form-row'>
      <div className='col-md-1'>Ethanol:</div>
     </div>
  <div className="form-row">
    <div className="col-md-3 mb-3">
      <input type="number" name='quantity1' value={details.quantity1} onChange={handleChange} className="form-control ip" id="quantity1" placeholder="Volume(L)" required />
      <div className="valid-tooltip">
        Looks good!
      </div>
    </div>
   
    <div className="col-md-3 mb-3">
      {/* <label for="validationTooltip02">Last name</label> */}
      <input type="number" name='weight1' onChange={handleChange} className="form-control ip" id="validationTooltip02" placeholder="Weight(KG)" value={details.weight1} required />
      <div className="valid-tooltip">
        Looks good!
      </div>
    </div>
    <div className='mx-3'>
    Rate: {rate1} /L
    </div>
    <div>
    Price: {rate1*details.quantity1} INR
    </div>
  </div>

  <div className='form-row'>
      <div className='col-md-1'>Petroleum:</div>
     </div>
  <div className="form-row">
    <div className="col-md-3 mb-3">
      <input type="number" name='quantity2' value={details.quantity2} onChange={handleChange} className="form-control ip" id="quantity2" placeholder="Volume(L)" />
      <div className="valid-tooltip">
        Looks good!
      </div>
    </div>
   
    <div className={`col-md-3 mb-3`}>
      {/* <label for="validationTooltip02">Last name</label> */}
      <input type="number" name='weight2' onChange={handleChange} className={`form-control ip`} id="validationTooltip02" placeholder="Weight(KG)" value={details.weight2} />
      <div className="valid-tooltip">
        Looks good!
      </div>
    </div>
    <div className='mx-3'>
    Rate: {rate2} /L
    </div>
    <div>
    Price: {rate2*details.quantity2} INR
    </div>
  </div>
  <div className='form-row'>
 <div className="col-md-4 my-3">
      <input type="text" name='receiver' value={details.receiver} onChange={handleChange} className="form-control ip" id="receiver" placeholder="Receiver ID" required />
      <div className="valid-tooltip">
        Looks good!
      </div>
    </div>
 </div>

   <div className='text-left my-3 mb-4 ip p-2 rounded' style={{width:"50%"}}>
    <div>Delivery Address: </div>
    <div>{productDetails.data.messageText}</div>
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
                setConfirmationMessage('Product sent');
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

            <FormControl>
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
          <FormControl style={{ float: 'right',display:"none" }}>
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

export default RefinerySendOrder;