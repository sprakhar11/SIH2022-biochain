const initialState = {
    sidebarStatus: [],
  };
  
  const SidebarStatus = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_PRODUCT': {
        const data = action.payload;
  
        return {
          ...state,
  
          sidebarStatus: data,
        };
      }
        
      case 'LOGOUT':
        return {
          ...state,
  
          sidebarStatus: [],
        };
  
      default:
        return state;
    }
  };
  
  export default SidebarStatus;