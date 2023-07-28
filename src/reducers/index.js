import AdditionalDetails from './AdditionalDetails';
import UserDetails from './UserDetails';
import UserBlockchainDetails from './UserBlockchainDetails';
import AllUsers from './AllUsers';
import SetProduct from './SetProduct';
import AvailableProduct from './AvailableProduct';
import SetCurrentProduct from './SetCurrentProduct';
import SidebarStatus from './SidebarStatus';
import { combineReducers } from 'redux';
import FlagValue from './FlagValue';

const rootReducer = combineReducers({
  AdditionalDetails,
  UserDetails,
  UserBlockchainDetails,
  SetProduct,
  AllUsers,
  AvailableProduct,
  SetCurrentProduct,
  SidebarStatus,
  FlagValue

});

export default rootReducer;
