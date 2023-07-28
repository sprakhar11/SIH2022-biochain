const initialState = {
    setCurrentProduct: [],
  };
  
  const SetCurrentProduct = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_CURRENT_PRODUCT': {
        const data = action.payload;
  
        return {
          ...state,
  
          setCurrentProduct: data,
        };
      }
        
      case 'LOGOUT':
        return {
          ...state,
  
          setCurrentProduct: [],
        };
  
      default:
        return state;
    }
  };
  
  export default SetCurrentProduct;