import { Routes, Route } from 'react-router-dom';
import './components/constants/constants.css';
import './App.css';
//import Quiz from './components/QuizComponents/quiz/Quiz';
import Register from './components/register/Register';
//import Create from './components/QuizComponents/CreateQuestions/Create';
import HomePage from './components/homepage/HomePage';
import Login from './components/loginanant/Login';
import AdditionalDetails from './components/register/AdditionalDetails';
import EthanolProducer from './components/ethanolProducer/EthanolProducer';
import EthanolProduct from './components/ethanolProducer/EthanolProduct';
import EthanolSendOrder from './components/ethanolProducer/EthanolSendOrder';
import BiomassUnit from './components/biomassUnit/BiomassUnit';
import BiomassProduct from './components/biomassUnit/BiomassProduct';
import BiomassSendOrder from './components/biomassUnit/BiomassSendOrder';
import Refinery from './components/refinery/Refinery';
import RefineryPlaceOrder from './components/refinery/RefineryPlaceOrder';
import RefineryProduct from './components/refinery/RefineryProduct';
import RefinerySendOrder from './components/refinery/RefinerySendOrder';
import Depot from './components/depot/Depot';
import DepotPlaceOrder from './components/depot/DepotPlaceOrder';
import DepotProduct from './components/depot/DepotProduct';
import DepotSendOrder from './components/depot/DepotSendOrder';
import RetailUnit from './components/retailer/RetailUnit';
import RetailPlaceOrder from './components/retailer/RetailPlaceOrder';
import RetailProduct from './components/retailer/RetailProduct';
import FireflyData from './components/firefly/FireflyData';
import TrackProduct from './components/TrackProduct';
// import questions from './components/questions';

function App() {
  return (
    <div className='App'>
        <div className='d-none'>
        <FireflyData />
        </div>
      <Routes>
        <Route path="/firefly" element={<FireflyData />}></Route>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/myprofile' element={<AdditionalDetails />}></Route>
        <Route path="/epu" element={<EthanolProducer />}></Route>
        <Route path='/epu/product' element={<EthanolProduct />}></Route>
        <Route path='/epu/sod' element={<EthanolSendOrder />}></Route>
        <Route path="/bmu" element={<BiomassUnit />}></Route>
        <Route path='/bmu/product' element={<BiomassProduct />}></Route>
        <Route path='/bmu/sod' element={<BiomassSendOrder />}></Route>
        <Route path="/ref" element={<Refinery />}></Route>
        <Route path="/ref/pod" element={<RefineryPlaceOrder />}></Route>
        <Route path='/ref/product' element={<RefineryProduct />}></Route>
        <Route path='/ref/sod' element={<RefinerySendOrder />}></Route>
        <Route path="/dep" element={<Depot />}></Route>
        <Route path="/dep/pod" element={<DepotPlaceOrder />}></Route>
        <Route path='/dep/product'element={<DepotProduct />}></Route>
        <Route path='/dep/sod' element={<DepotSendOrder />}></Route>
        <Route path="/rtl" element={<RetailUnit />}></Route>
        <Route path='/rtl/pod' element={<RetailPlaceOrder />}></Route>
        <Route path='/rtl/product' element={<RetailProduct />}></Route>
        <Route path='/tp' element={<TrackProduct />}></Route>
        {/* <Route path='/quiz' element={<Quiz />}></Route>
        <Route path='/create' element={<Create />}></Route> */}
      </Routes>
    </div>
  );
}

export default App;
