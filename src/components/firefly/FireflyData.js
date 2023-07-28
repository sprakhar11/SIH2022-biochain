import { Box, Button, FormControl, FormControlLabel, Checkbox, FormLabel, FormGroup, Grid, makeStyles, MenuItem, Paper, Select, Snackbar, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField, } from '@material-ui/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FireFly, } from '../../firefly';
import ReconnectingWebsocket from 'reconnecting-websocket';
import { useDispatch, useSelector } from 'react-redux';
import { UserBlockchainDetails, AllUsers } from '../../actions';
import { url } from '../../utilities';
// import {useState,useEffect} from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
// import Product from './Product';
const MEMBERS = [
    'http://localhost:5000',
    'http://localhost:5001',
];
const MAX_MESSAGES = 50;
const DATE_FORMAT = 'MM/DD/YYYY h:mm:ss A';
const FireflyData=()=> {
    let dispatch = useDispatch();
    // dispatch(UserBlockchainDetails(res.data));
    const userData = useSelector((state) => state.UserDetails.userDetails);
  const [user, setUser] = useState({
    name: userData.name,
    deliveryaddress: userData.deliveryaddress,
  });
   
    const classes = useStyles();
    const [ethanolProducerData, setEthanolProducerData] = useState([]);
    const [biomassUnitData, setBiomassUnitData] = useState([]);
    const [refineryData, setRefineryData] = useState([]);
    const [depotData, setDepotData] = useState([]);
    const [retailUnitData] = useState([]);
    const [userBlockchainData, setUserBlockchainData] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [selectedMember, setSelectedMember] = useState(0);
    const firefly = useRef(null);
    const ws = useRef(null);
    const [isPrivate, setIsPrivate] = useState(false);
    const [orgs, setOrgs] = useState([]);
    const [pickedOrgs, setPickedOrgs] = useState({});
    const [selfOrg, setSelfOrg] = useState('');
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const load = useCallback(async () => {
        const host = MEMBERS[selectedMember];
        console.log(`Loading data from ${host}`);
        firefly.current = new FireFly(host);
        const messages = await firefly.current.getMessages(MAX_MESSAGES);
        const rows = [];
        const userArr =[];
        const msg = [];
        for (const message of messages) {
            rows.push({
                message,
                data: await firefly.current.retrieveData(message.data),
            });
            const obj = await axios.get(`http://127.0.0.1:5000/api/v1/namespaces/default/messages/${message.header.id}/data`).then((res)=>{
                return res.data[0].value;
            })
            msg.push(obj);
            if(obj.details.sender==userData._id || obj.details.receiver==userData._id)
            {
                userArr.push({
                    message,
                    data: obj
                })
            }
        }
        console.log("pleaseee",userArr);
        dispatch(UserBlockchainDetails(userArr));
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
    const MessageList = (options) => {
        const { messages } = options;
        const classes = useStyles();
        const rows = [];
        for (const message of messages) {
            const date = dayjs(message.message.header.created);
            rows.push(<TableRow key={message.message.header.id}>
          <TableCell>{date.format(DATE_FORMAT)}</TableCell>
          <TableCell>{orgName(message)}</TableCell>
          <TableCell className={classes.scrollRight}>
            <div>
              {/* <pre>
                {message.data
                    .map((d) => JSON.stringify(d?.value || '', null, 2))
                    .join(', ')}
              </pre> */}
              <pre>
                {message.data
                    .map((d,i) => {if(d){
                        // console.log(messages)
                        const obj = JSON.stringify(d.value)
                        const x = d.value.details?d.value.details:"";
                       
                        return(
                        <div key={i}>
                            <div>{message.message.header.id}</div>
                             <div>{x.product}</div>
                             <div>{x.type}</div>
                             <div>{x.quantity}</div>
                             <div>{x.price}</div>
                             <div>{x.sender}</div>
                             <div>{x.receiver}</div>
                        </div>
                    )}
                   })}
              </pre>
            </div>
          </TableCell>
        </TableRow>);
        }
        return (<Table>
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>From</TableCell>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>);
    };

    const getAllUsers = async()=>{
        try{
            const users=[];
            const response = await axios.get(`${url}/api/auth/getAll`);
            const data = response.data;
            console.log(data);
            for(const user in data)
            {
                const obj = {
                    id: data[user]._id,
                    name: data[user].name,
                    type:data[user].type,
                    deliveryAddress: data[user].deliveryaddress,
                    email:data[user].email

                }
                users.push(obj);
            }
            console.log("users",users);
            dispatch(AllUsers(users));
        }
        catch(err){
            console.log("shds",err);
        }
    }
    useEffect(() => {
        load();getAllUsers();
    }, [load]);
    return (<div className={classes.root}>
        
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
                    
                    await firefly.current?.sendBroadcast([
                        {
                            
                            value: messageText
                        },
                    ]);
                }
                setConfirmationMessage('Message sent');
            }
            catch (err) {
                setConfirmationMessage(`Error: ${err}`);
            }
            setMessageText('');
        }}>
            <h1>Send Message</h1>

            <FormControlLabel control={<Switch checked={!isPrivate} color="primary" onClick={() => setIsPrivate(!isPrivate)}/>} label={isPrivate
            ? 'Choose recipients'
            : 'Broadcast to the whole network'} className={classes.formControl}/>

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

            <FormControl className={classes.formControl} fullWidth={true}>
              <TextField label="Message" variant="outlined" value={messageText} onChange={(event) => setMessageText(event.target.value)}/>
            </FormControl>

            <FormControl className={classes.formControlRight}>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </FormControl>

            <div className={classes.clearFix}/>
          </Paper>

          <br />

          <Paper className={classes.paper}>
            <h1>Last {MAX_MESSAGES} Messages Received</h1>

            <MessageList messages={messages}/>
          </Paper>
        </Grid>
        <Grid item xs={1} md={2} xl={3}>
          <FormControl style={{ float: 'right' }}>
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
    </div>);
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
export default FireflyData;