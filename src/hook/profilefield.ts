export const initProfileState = {
  name: '',
  lastName: '',
  birthDay: '',
  tel: '',
  address1: '',
  address2: '',
  province: '',
  subdistrict: '',
  district: '',
  postcode: '',
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
        lastName: action.lastName,
        id: action.id,
        image: action.image,
        plotItem: action.plotItem,
        status: action.status,
        birthDay: action.birthDay,
        tel: action.tel,
        address1: action.address1,
        address2: action.address2,
        province: action.province,
        subdistrict: action.subdistrict,
        district: action.district,
        postcode: action.postcode,
      };

    default:
      return state;
  }
};

export const initDetailDronerState = {
  name: '',
  id: '',
  imagePro: '',
  imageTask: [],
  rate: '',
  total_task: '',
  distance: '',
  district: '',
  province: '',
  droneBand: '',
  price: '',
  dronerQueue: [],
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
        dronerQueue: action.dronerQueue,
      };

    default:
      return state;
  }
};
