export const initProfileState = {
    name: '',
    id: '',
    image: '',
    plotItem: [],
    status: '',
  };
  
  export const profileReducer = (state: any, action: any) => {
    switch (action.type) {
      case 'InitProfile':
        return {
          name: action.name,
          id: action.id,
          image: action.image,
          plotItem: action.plotItem,
          status: action.status,
        };
  
      default:
        return state;
    }
  };
  