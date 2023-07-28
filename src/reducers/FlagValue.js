const initialState = {
    flagValue: [],
  };
  
  const FlagValue = (state = initialState, action) => {
    switch (action.type) {
      case 'FLAG_VALUE': {
        const data = action.payload;
  
        return {
          ...state,
  
          flagValue: data,
        };
      }
        
      case 'LOGOUT':
        return {
          ...state,
  
          flagValue: [],
        };
  
      default:
        return state;
    }
  };

  export default FlagValue;
  