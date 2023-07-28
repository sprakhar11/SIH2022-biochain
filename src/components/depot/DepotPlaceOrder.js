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
import './DepotPlaceOrder.css';

const MEMBERS = [
    'http://localhost:5000',
    'http://localhost:5001',
];

const MAX_MESSAGES = 50;
const DATE_FORMAT = 'MM/DD/YYYY h:mm:ss A';

const DepotPlaceOrder=()=> {

    // const additionalDetails = useSelector(
    //     (state) => state.AdditionalDetails.additionalDetails
    //   );
    const dispatch = useDispatch();
     let navigate = useNavigate();
     const allUsers = useSelector((state)=>state.AllUsers.allUsers)
     const [receiverId, setReceiverId] = useState("");
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
      const senderDetails = {
        deliveryaddress:userData.deliveryaddress
      }
      const [details, setDetails] = useState({
        productId: productDetails?productDetails.data.details.productId:uuid(),
        product1: "ETHANOL",
        product2:"PETROLEUM",
        quantity1:d?d.quantity1:"",
        weight1:"",
        quantity2:d?d.quantity2:"",
        weight2:"",
        price1:0,
        price2:0,
        sender:userData._id,
        receiver:"",
        senderType:userData.type,
        receiverType:"Refinery",
        senderName:userData.name,
        orderStatus: "fromDepo",
        productStatus: "",
        senderDetails:senderDetails,
   })
   const handleChange = (e) => {
       e.preventDefault();
       const name = e.target.name;
       const value = e.target.value;
      //  details.receiver = receiverId;
       setDetails({ ...details, [name]: value });
     };
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
     if (!userData.accessToken || userData.type!="Depot") {
       navigate('/login');
     }
   }, [userData, navigate]);
   
   useEffect(() => {
       load();
       console.log(details);
   }, [load]);
   
  return (
    <div className={`d-flex flex-column align-items-center`}>
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
   
    {/* <div className="col-md-3 mb-3">
      <input type="number" name='weight1' onChange={handleChange} className="form-control ip" id="validationTooltip02" placeholder="Weight(KG)" value={details.weight1} required />
      <div className="valid-tooltip">
        Looks good!
      </div>
    </div> */}
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
   
    {/* <div className={`col-md-3 mb-3`}>
      <input type="number" name='weight2' onChange={handleChange} className={`form-control ip`} id="validationTooltip02" placeholder="Weight(KG)" value={details.weight2} />
      <div className="valid-tooltip">
        Looks good!
      </div>
    </div> */}
    <div className='mx-3'>
    Rate: {rate2} /L
    </div>
    <div>
    Price: {rate2*details.quantity2} INR
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
            if(d.type=="Refinery")
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
      <input type="text" name='receiver' value={receiverId} onChange={handleChange} className="form-control ip" id="receiver" placeholder="Receiver ID" required />
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

        {/* <form className='form d-flex flex-column align-items-start'>
        
        <div className='field' id='quantity1'>
          <label className='question mx-5 my-2'>
            Ethanol <span className='mandatory'>*</span>
          </label>
          <input
            type="number"
            className={`p-2 border-none`}
            name='quantity1'
            placeholder="Quantity"
            value={details.quantity1}
            onChange={handleChange}
          />L
         
        </div>
        <div className=' mx-5 my-2'>Rate: {rate1} /L</div>
        <div className=' mx-5 my-2'>Price: {rate1*details.quantity1} INR</div>

        <div className='field' id='quantity2'>
          <label className='question mx-5 my-2'>
            Petroleum <span className='mandatory'>*</span>
          </label>
          <input
            type="number"
            className={`p-2 border-none`}
            name='quantity2'
            placeholder="Quantity"
            value={details.quantity2}
            onChange={handleChange}
          />L
         
        </div>
        <div className=' mx-5 my-2'>Rate: {rate2} /L</div>
        <div className=' mx-5 my-2'>Price: {rate2*details.quantity2} INR</div>

        <div className='field' id='receiver'>
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
        </div>

      </form> */}
      <Grid container spacing={3}>
        <Grid item xs={1} md={2} xl={3}/>
        <Grid item xs={10} md={8} xl={6}>
          <Paper component="form" onSubmit={async (event) => {
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
                setConfirmationMessage('Order Placed');
            }
            catch (err) {
                setConfirmationMessage(`Error: ${err}`);
            }
            setMessageText('');
        }}>

            <FormControlLabel control={<Switch checked={!isPrivate} color="primary" onClick={() => setIsPrivate(!isPrivate)}/>} label={isPrivate
            ? 'Choose recipients'
            : 'Broadcast to the whole network'} className={`d-none`}/>
            {isPrivate && (<Box>
                <FormControl component="fieldset">
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

            <FormControl className={` d-none`} fullWidth={true}>
              <TextField label="Message" variant="outlined" value={messageText} onChange={(event) => setMessageText(event.target.value)}/>
            </FormControl>

            <FormControl >
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </FormControl>

            <div/>
          </Paper>

          <br />

          {/* <Paper className={classes.paper}>
            <h1>Last {MAX_MESSAGES} Messages Received</h1>

            <MessageList messages={messages}/>
          </Paper> */}
        </Grid>
        <Grid item xs={1} md={2} xl={3}>
          <FormControl style={{ float: 'right',visibility:"hidden" }}>
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



export default DepotPlaceOrder;