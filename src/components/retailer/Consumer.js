import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCallback,useRef} from 'react';
import { url } from '../../utilities';
import { Link } from 'react-router-dom';
// import { SetProduct } from '../../actions';
import { SetProduct,AvailableProduct, FlagValue} from '../../actions';
import styles from './RetailUnit.module.css';
import { Box, Button, FormControl, FormControlLabel, Checkbox, FormLabel, FormGroup, Grid, makeStyles, MenuItem, Paper, Select, Snackbar, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField, } from '@material-ui/core';
import moment from 'moment';
import { FireFly } from '../../firefly';



const Consumer = ()=>{
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const userData = useSelector((state) => state.UserDetails.userDetails);
    const [messageText,setMessageText]=useState("Updated");
    const availableProduct = useSelector((state)=>state.AvailableProduct.availableProduct);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    // const [available, setAvailable] = useState('');
    const userBlockchainDetails = useSelector((state)=>state.UserBlockchainDetails.userBlockchainDetails);
    const firefly = useRef(null);
    const capacityBioethanol = availableProduct.bioethanol;
    const capacityBiodiesel = availableProduct.biodiesel;
    const [available, setAvailable] = useState({bioethanol:capacityBioethanol?capacityBioethanol:5000,biodiesel:capacityBiodiesel?capacityBiodiesel:1000});
    const classes = useStyles();
    const flagValue = useSelector((state)=>state.FlagValue.flagValue);
    const [flag,setFlag] = useState(flagValue?flagValue:0);
    const host ='http://localhost:5000';
    
    firefly.current = new FireFly(host);
    
    const [details, setDetails] = useState({
        productId: "",
        product1: "BIOETHANOL",
        product2: "BIODIESEL",
        product:"",
        quantity:"",
        quantity1:"",
        quantity2:'',
        availableEth:availableProduct.bioethanol,
        availableDsl:availableProduct.biodiesel,
        weight:"",
        price:"",
        sender:userData._id,
        receiver:userData._id,
        senderType:userData.type,
        receiverType:userData.type,
        senderName:userData.name,
        orderStatus: "AtRet",
        productStatus: "AtRet"
   })

    const [consumed, setConsumed] = useState({
        bioethanol:0,
        biodiesel:0,
        sender:userData.id,
        receiver:userData.id
    })
    
    const handleChange = (e) => {
        e.preventDefault();
        const name = e.target.name;
        const value = e.target.value;
    
        setConsumed({ ...consumed, [name]: value });
        // const updateEthanol = availableProduct.bioethanol - consumed.bioethanol;
        // const updateDiesel = availableProduct.biodiesel - consumed.biodiesel;
        // setAvailable({bioethanol:updateEthanol,biodiesel:updateDiesel})
        // dispatch(AvailableProduct({bioethanol:updateEthanol,biodiesel:updateDiesel}))
    };
    
    const updateAvailability = ()=>{
        console.log("ap",availableProduct)
        console.log("cm",consumed);
        const updateEthanol = availableProduct.bioethanol - consumed.bioethanol;
        const updateDiesel = availableProduct.biodiesel - consumed.biodiesel;
        setAvailable({bioethanol:updateEthanol,biodiesel:updateDiesel})
        dispatch(AvailableProduct({bioethanol:updateEthanol,biodiesel:updateDiesel}))
        // dispatch(AvailableProduct(available));

    //    setAvailable({bioethanol:updateEthanol,biodiesel:updateDiesel});
    // setAvailable({bioethanol:updateEthanol,biodiesel:updateDiesel});
    // console.log("avai",available);
      }
    //  useEffect(()=>{
    //    console.log(details);
    //    dispatch(AvailableProduct(available));
    //  },[available])

    useEffect(()=>{
        const arr = userBlockchainDetails.reverse();
        for(const d in arr){
        
          const data = arr[d].data.details;
          console.log(data);
          console.log("first")
          if (data.senderType == userData.type) {
            if(data.availableEth){

                if((data.availableEth!=""&&flag!=1))
                {
                 setFlag(1);
                 dispatch(FlagValue(1));
                 console.log("here,",data.availableEth)
                
                //   const av = {bioethanol:data.availableEth,biodiesel:data.availableDsl}
                  console.log("in",available)
                  // dispatch(AvailableProduct({bioethanol:data.availableEth, biodiesel:data.availableDsl}));
                  dispatch(AvailableProduct({bioethanol:data.availableEth,biodiesel:data.availableDsl}));
                }
            }
      }}},[])

      useEffect(()=>{
        console.log(availableProduct);
      },[availableProduct])
     return(
        <div>
            <div>{availableProduct.bioethanol}</div>
            <div>{availableProduct.biodiesel}</div>
            <Paper className={`${classes.paper}`} component="form" onSubmit={async (event) => {
            event.preventDefault();
            try {   
                    setConsumed(consumed);
                    setDetails({...details,messageText});
                    await firefly.current?.sendBroadcast([
                        {
                            
                            value: {details:details,messageText}
                        },
                    ]);
                
                setConfirmationMessage('Updated');
            }
            catch (err) {
                setConfirmationMessage(`Error: ${err}`);
            }
            alert(confirmationMessage)
            
        }}>

     <div className='d-flex justify-content-center align-items-center'>
            <FormControl className={`${classes.formControl} mx-3`} >
              <TextField name="bioethanol" value={consumed.bioethanol} label="Bioethanol" variant="outlined" onChange={handleChange}/>
            </FormControl>
            <FormControl className={`${classes.formControl}`} >
              <TextField name="biodiesel" label="Biodiesel" variant="outlined" value={consumed.biodiesel} onChange={handleChange}/>
            </FormControl>

            <FormControl className='mx-4 mt-4' >
              <Button variant="contained" color="primary" onClick={updateAvailability}>
                Consume
              </Button>
            </FormControl>
            <FormControl className='mx-4 mt-4' >
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </FormControl>
            </div>

            <div className={classes.clearFix}/>
          </Paper>
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
export default Consumer;