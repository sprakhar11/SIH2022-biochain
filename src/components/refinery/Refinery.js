import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { url } from '../../utilities';
import { Link } from 'react-router-dom';
// import { SetProduct } from '../../actions';
import { SetProduct,AvailableProduct } from '../../actions';
import moment from 'moment';
import styles from './Refinery.module.css';

const Refinery=()=> {
  let count=0;
    const dispatch = useDispatch();
     let navigate = useNavigate();
      const userData = useSelector((state) => state.UserDetails.userDetails);
      const availableProduct = useSelector((state)=>state.AvailableProduct.availableProduct);
      const [available, setAvailable] = useState(availableProduct.ethanol?availableProduct:{ethanol:10000,petroleum:30000});
      const [user, setUser] = useState({
        name: userData.name,
        deliveryaddress: userData.deliveryaddress,
      });
    const userBlockchainDetails = useSelector((state)=>state.UserBlockchainDetails.userBlockchainDetails);
    // const setProduct = useSelector((state)=>state.SetProduct.setProduct)
    console.log(userBlockchainDetails);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.accessToken}`,
        },
      };
      
      useEffect(() => {
        if (!userData.accessToken || userData.type!="Refinery") {
          navigate('/login');
        }
    
        // console.log(userData.accessToken);
        // console.log(config);
        // console.log(user);
      }, [userData, navigate]);

      useEffect(()=>{
        dispatch(AvailableProduct(available));
        console.log(availableProduct);
      })

  return (
    <div>
        <div>Refinery</div>

        <h4>Avaibility:</h4>
        <h2>ETHANOL: {availableProduct.ethanol}</h2>
        <h2>PETROLEUM: {availableProduct.petroleum}</h2>
       
        <table className="table">
        <div>Incoming Consignments</div>
        <thead className="thead-light">
          <tr className='m-3'>
            <th scope="col">#</th>
            <th scope="col-sm">Order ID</th>
            <th scope="col">From</th>
            <th scope="col">Product(s)</th>
            <th scope="col">Quantity</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {


            userBlockchainDetails.map((d,i) => {
              const data = d.data.details;
              console.log(data)
              if (data.senderType != userData.type) {
                count = count + 1;

                return (

                  <tr key={i} className={`${styles.dashboardRows}`}>
                    <th scope="row">{count}</th>
                    <td>
                      <div className='d-flex flex-column align-items-start'>
                        <div>
                          {data.productId}
                        </div>
                        <div className='small'>{moment(d.message.confirmed).utc().format('DD-MM-YYYY')}</div>
                      </div>
                    </td>
                    <td>
                      <div className='small text-primary'>{data.senderType}</div>
                      <div>{data.senderName}</div>
                    </td>
                    <td>{data.product ? data.product : data.product1}   {data.product ? "" : data.product2}</td>
                    <td>{`${data.quantity ? data.quantity : data.quantity1}L`}   {data.quantity ? "" : data.quantity2}</td>
                    <td><Link to="/ref/product"><button onClick={() => { dispatch(SetProduct(d)) }}>View</button></Link></td>
                  </tr>

                )
              }
            })
          }
        </tbody>

        <div>Outgoing Consignments</div>

        <tbody style={{ background: "white", margin: "5px" }}>
          {


            userBlockchainDetails.map((d,i) => {
              const data = d.data.details;
              console.log(data)
              if (data.senderType == userData.type) {
                count = count + 1;

                return (

                  <tr key={i} className={`${styles.dashboardRows}`}>
                    <th scope="row">{count}</th>
                    <td>
                      <div className='d-flex flex-column align-items-start'>
                        <div>
                          {data.productId}
                        </div>
                        <div className='small'>{moment(d.message.confirmed).utc().format('DD-MM-YYYY')}</div>
                      </div>
                    </td>
                    <td>
                      <div className='small text-primary'>{data.senderType}</div>
                      <div>{data.senderName}</div>
                    </td>
                    <td>{data.product ? data.product : data.product1}   {data.product ? "" : data.product2}</td>
                    <td>{`${data.quantity ? data.quantity : data.quantity1}L`}   {data.quantity ? "" : data.quantity2}</td>
                    <td><Link to="/ref/product"><button onClick={() => { dispatch(SetProduct(d)) }}>View</button></Link></td>
                  </tr>

                )
              }
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default Refinery;