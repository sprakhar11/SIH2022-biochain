const initialState = {
    userBlockchainDetails: [],
  };
  
  const UserBlockchainDetails = (state = initialState, action) => {
    switch (action.type) {
      case 'USER_BLOCKCHAIN_DETAILS': {
        const data = action.payload;
  
        return {
          ...state,
  
          userBlockchainDetails: data,
        };
      }
        
      case 'LOGOUT':
        return {
          ...state,
  
          userBlockchainDetails: [],
        };
  
      default:
        return state;
    }
  };
  
  export default UserBlockchainDetails;
  