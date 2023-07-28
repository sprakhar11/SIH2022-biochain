const initialState = {
    availableProduct: [],
  };
  
  const AvailableProduct = (state = initialState, action) => {
    switch (action.type) {
      case 'AVAILABLE_PRODUCT': {
        const data = action.payload;
  
        return {
          ...state,
  
          availableProduct: data,
        };
      }
        
      case 'LOGOUT':
        return {
          ...state,
  
          availableProduct: [],
        };
  
      default:
        return state;
    }
  };
  
  export default AvailableProduct;