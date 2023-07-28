const initialState = {
    allUsers: [],
  };
  
  const AllUsers = (state = initialState, action) => {
    switch (action.type) {
      case 'ALL_USERS': {
        const data = action.payload;
  
        return {
          ...state,
  
          allUsers: data,
        };
      }
        
      case 'LOGOUT':
        return {
          ...state,
  
          allUsers: [],
        };
  
      default:
        return state;
    }
  };
  
  export default AllUsers;
  