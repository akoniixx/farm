interface FileDetail {
  id: string;
  fileName: string;
  fileType: string;
  path: string;
  resource: string;
  dronerId: string | null;
  farmerId: string;
  droneId: string | null;
  droneBrandId: string | null;
  dronerDroneId: string | null;
  category: string;
  createdAt: string; // Consider using Date if you're going to manipulate it as a date object.
}

interface Droner {
  id: string;
  pin: string;
  dronerCode: string;
  firstname: string;
  lastname: string;
  idNo: string;
  telephoneNo: string;
  status: string;
  reason: string[];
  birthDate: string;
  isOpenReceiveTask: boolean;
  expYear: number;
  expMonth: number;
  expPlant: string[];
  addressId: string;
  dronerAreaId: string;
  createdAt: string;
  updatedAt: string;
  isDelete: boolean;
  deleteDate: string | null;
  comment: string;
  updateBy: string;
  createBy: string;
  isBookBank: boolean;
  bankName: string;
  bankAccountName: string;
  accountNumber: string;
  isConsentBookBank: boolean;
  otherAddressId: string | null;
  percentSuccess: number;
}

interface PlotArea {
  subdistrictId: number;
  subdistrictName: string;
  districtId: number;
  districtName: string;
  provinceId: number;
  provinceName: string;
  lat: string;
  long: string;
  postcode: string;
}

interface FarmerPlot {
  id: string;
  plotName: string;
  raiAmount: string;
  landmark: string;
  plantName: string;
  plantNature: string | null;
  mapUrl: string | null;
  lat: string;
  long: string;
  locationName: string;
  farmerId: string;
  plotAreaId: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDelete: boolean;
  comment: string;
  reason: string;
  status: string;
  plotArea: PlotArea;
}

export interface Task {
  id: string;
  taskNo: string;
  farmerId: string;
  farmerPlotId: string;
  farmAreaAmount: string; // Assuming it's a string, though it might be a number depending on the context.
  dronerId: string;
  purposeSprayId: string;
  dateAppointment: string; // Consider using Date if you're going to manipulate it as a date object.
  targetSpray: string[]; // If the array always contains strings
  preparationBy: string;
  createdAt: string; // Consider using Date if you're going to manipulate it as a date object.
  updatedAt: string; // Consider using Date if you're going to manipulate it as a date object.
  createBy: string;
  updateBy: string;
  distance: string; // Assuming it's a string, though it might be a number depending on the context.
  status: string;
  statusRemark: string;
  reviewDronerAvg: null | number; // Assuming it's a number when not null
  reviewDronerDetail: null | string; // Assuming it's a string when not null
  unitPriceStandard: string; // Assuming it's a string, though it might be a number depending on the context.
  priceStandard: string; // Assuming it's a string, though it might be a number depending on the context.
  unitPrice: string; // Assuming it's a string, though it might be a number depending on the context.
  price: number;
  totalPrice: string; // Assuming it's a string, though it might be a number depending on the context.
  fee: string; // Assuming it's a string, though it might be a number depending on the context.
  discountFee: string; // Assuming it's a string, though it might be a number depending on the context.
  reviewFarmerScore: null | number; // Assuming it's a number when not null
  reviewFarmerComment: null | string; // Assuming it's a string when not null
  imagePathFinishTask: null | string; // Assuming it's a string when not null
  comment: string;
  isProblem: boolean;
  problemRemark: null | string; // Assuming it's a string when not null
  isDelay: boolean;
  delayRemark: string | null;
  dateDelay: string | null; // Consider using Date if you're going to manipulate it as a date object.
  statusDelay: string | null;
  delayRejectRemark: string | null;
  couponCode: string;
  couponId: string | null;
  discountCoupon: string; // Assuming it's a string, but it could also be a number.
  countResend: number | null;
  statusPayment: string | null;
  bankName: string | null;
  bankAccountName: string | null;
  accountNumber: string | null;
  isConsentBookBank: boolean;
  bookBankPath: string | null;
  discountPromotion: string; // Assuming it's a string, but could also be a number.
  revenuePromotion: string; // Assuming it's a string, but could also be a number.
  discountCampaignPoint: string; // Assuming it's a string, but could also be a number.
  usePoint: string; // Assuming it's a string, but could also be a number.
  imagePathDrug: string | null;
  dateWaitPayment: string | null; // Consider using Date if you're going to manipulate it as a date object.
  applicationType: string;

  purposeSpray: {
    id: string;
    cropId: string;
    purposeSprayName: string;
    crop: {
      id: string;
      cropName: string;
    };
  };

  farmer: {
    id: string;
    pin: string;
    farmerCode: string;
    firstname: string;
    lastname: string;
    idNo: string;
    telephoneNo: string;
    status: string;
    reason: string;
    birthDate: string; // Consider using Date if you're going to manipulate it as a date object.
    addressId: string;
    createdAt: string; // Consider using Date if you're going to manipulate it as a date object.
    updatedAt: string; // Consider using Date if you're going to manipulate it as a date object.
    comment: string | null;
    updateBy: string;
    createBy: string | null;
    isDelete: boolean;
    file: FileDetail[];
  };
  droner: Droner;
  farmerPlot: FarmerPlot;
  taskHistory: any[]; // you might want to define an interface for this if you know its structure
  idTask: string;
  title: string;
  date: string;
  address: string;
  user: string;
  img: string;
  preparation: string;
  tel: string;
  taskId: string;
  farmArea: string;
  toggleModalStartTask: boolean;
  maxRatting: number[];
  defaultRating: number;
  starImgFilled: number;
  starImgCorner: number;
  imgUploaded: boolean;
  finishImg: string | null;
  error: string;
}
