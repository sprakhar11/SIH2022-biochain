const initialState = {
    setProduct: [],
  };
  
  const SetProduct = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_PRODUCT': {
        const data = action.payload;
  
        return {
          ...state,
  
          setProduct: data,
        };
      }
        
      case 'LOGOUT':
        return {
          ...state,
  
          setProduct: [],
        };
  
      default:
        return state;
    }
  };
  
  export default SetProduct;