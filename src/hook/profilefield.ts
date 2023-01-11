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

export const initDetailDronerState = {
  name: '',
  id: '',
  imagePro: '',
  imageTask: '',
  rate: '',
  total_task: '',
  distance: '',
  district: '',
  province: '',
  droneBand: '',
  price: '',
};

export const detailDronerReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'InitDroner':
      return {
        name: action.name,
        id: action.id,
        imagePro: action.imagePro,
        imageTask: action.imageTask,
        rate: action.rate,
        total_task: action.total_task,
        distance: action.distance,
        province: action.province,
        district: action.district,
        droneBand: action.droneBand,
        price: action.price,
      };

    default:
      return state;
  }
};
