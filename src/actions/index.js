//For storing additional details of user
export const AddDetails = (data) => {
  return {
    type: 'ADD_DETAILS',
    payload: data,
  };
};

//For basic user details
export const UserDetails = (data) => {
  return {
    type: 'USER_DETAILS',
    payload: data,
  };
};

export const AllUsers = (data)=>{
  return{
    type:"ALL_USERS",
    payload: data
  }
}

export const UserBlockchainDetails = (data) => {
  return {
    type: 'USER_BLOCKCHAIN_DETAILS',
    payload: data,
  };
};

export const SetProduct = (data)=>{
  return{
    type:'SET_PRODUCT',
    payload:data,
  };
}

export const SetCurrentProduct = (data)=>{
  return{
    type:'SET_CURRENT_PRODUCT',
    payload:data,
  };
}

export const AvailableProduct = (data)=>{
  return{
    type: "AVAILABLE_PRODUCT",
    payload:data,
  }
}

export const SidebarStatus = (data)=>{
  return{
    type: "SIDEBAR_STATUS",
    payload:data,
  }
}
export const FlagValue = (data)=>{
  return{
    type: "FLAG_VALUE",
    payload:data,
  }
}


export const LogoutUser = () => {
  return {
    type: 'LOGOUT',
  };
};
