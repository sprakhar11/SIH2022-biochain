import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
ReactDOM.render(
<Provider store={store}>
   
      <Router>
        <App />
      </Router>
   
  </Provider>, document.getElementById('root'));

{/* <React.StrictMode>
      <Router>
        <App />
      </Router>
    </React.StrictMode> */}
// import React from 'react';
// import ReactDOM from 'react-dom';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import App from './App';
// import { BrowserRouter as Router } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import store from './store';
// // import {createRoot} from 'react-dom/client';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <Provider store={store}>
//     <React.StrictMode>
//       <Router>
//         <App />
//       </Router>
//     </React.StrictMode>
//   </Provider>
// );