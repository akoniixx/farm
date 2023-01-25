import moment from 'moment';
import * as React from 'react';
import { PayloadCal, PlotDatasource } from '../datasource/PlotDatasource';
export interface TaskDataType {
  farmerId: string;
  farmerPlotId: string;
  farmAreaAmount: string;
  dateAppointment: string;
  targetSpray: string[];
  preparationBy: string;
  purposeSpray: {
    id: string;
    name: string;
  };
  taskDronerTemp: {
    dronerId: string;
    status: string;
    dronerDetail: string[];
  }[];
  status?: string;
  statusRemark?: string;
  createBy?: string;
  cropName?: string;
  comment?: string;
  couponCode?: string;
  plantName?: string;
  plotName?: string;
  locationName?: string;
  plotArea?: {
    subdistrictId?: number;
    subdistrictName?: string;
    districtId?: number;
    districtName?: string;
    provinceId?: number;
    provinceName?: string;
    lat?: string;
    long?: string;
    postcode?: string;
  };
}
export interface LocationPriceType {
  createdAt: string;
  cropName: string;
  id: string;
  price: string;
  provinceId: number;
  updateBy: string;
  updatedAt: string;
}
export interface CalPriceType {
  pricePerRai: number;
  netPrice: number;
  couponId: string | null;
  discountFee: number;
  priceBefore: number;
  priceCouponDiscount: number;
}
interface State {
  taskData: TaskDataType;
  locationPrice: LocationPriceType;
  calPrice: CalPriceType;
}
interface Context {
  autoBookingContext: {
    setTaskData: React.Dispatch<React.SetStateAction<TaskDataType>>;
    getLocationPrice: (payload: {
      provinceId: string;
      cropName: string;
    }) => Promise<void>;
    searchDroner: (payload: {
      farmerId: string;
      farmerPlotId: string;
    }) => Promise<void>;
    getCalculatePrice: (payload: PayloadCal) => Promise<void>;
  };
  state: State;
}
export const initialState: {
  taskData: TaskDataType;
  locationPrice: LocationPriceType;
  calPrice: CalPriceType;
} = {
  taskData: {
    farmerId: '',
    farmerPlotId: '',
    farmAreaAmount: '',
    dateAppointment: '',
    targetSpray: [],
    preparationBy: '',
    purposeSpray: {
      id: '',
      name: '',
    },
    taskDronerTemp: [],
    status: 'WAIT_RECEIVE',
    statusRemark: '',
    createBy: '',
    cropName: '',
    comment: '',
    couponCode: undefined,
    plotArea: {
      subdistrictId: undefined,
      subdistrictName: undefined,
      districtId: undefined,
      districtName: undefined,
      provinceId: undefined,
      provinceName: undefined,
      lat: undefined,
      long: undefined,
      postcode: undefined,
    },
  },
  locationPrice: {
    createdAt: '',
    cropName: '',
    id: '',
    price: '',
    provinceId: 0,
    updateBy: '',
    updatedAt: '',
  },
  calPrice: {
    pricePerRai: 0,
    netPrice: 0,
    couponId: null,
    discountFee: 0,
    priceBefore: 0,
    priceCouponDiscount: 0,
  },
};
const AutoBookingContext = React.createContext<Context>({
  autoBookingContext: {
    setTaskData: () => {},
    searchDroner: () => Promise.resolve(),
    getLocationPrice() {
      return Promise.resolve();
    },
    getCalculatePrice: () => Promise.resolve(),
  },
  state: initialState,
});
export const AutoBookingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [taskData, setTaskData] = React.useState<TaskDataType>(
    initialState.taskData,
  );
  const [locationPrice, setLocationPrice] = React.useState<LocationPriceType>(
    initialState.locationPrice,
  );
  const [calPrice, setCalPrice] = React.useState<CalPriceType>(
    initialState.calPrice,
  );

  const { getLocationPrice, searchDroner, getCalculatePrice } =
    React.useMemo(() => {
      const getLocationPrice = async (payload: {
        provinceId: string;
        cropName: string;
      }) => {
        try {
          const res = await PlotDatasource.getLocationPrice(payload);
          setLocationPrice(res);
        } catch (e) {
          console.log(e);
        }
      };
      const searchDroner = async ({
        farmerId,
        farmerPlotId,
      }: {
        farmerId: string;
        farmerPlotId: string;
      }) => {
        try {
          const res = await PlotDatasource.searchDroner({
            farmerId: farmerId,
            farmerPlotId: farmerPlotId,
            dateAppointment: moment(taskData.dateAppointment).format(
              'YYYY-MM-DD',
            ),
          });
          const newArray: any = [];
          for (let i = 0; i < (res.length > 5 ? 5 : res.length); i++) {
            newArray.push({
              dronerId: res[i].droner_id,
              status: 'WAIT_RECEIVE',
              dronerDetail: [
                JSON.stringify({
                  ...res[i],
                  isChecked: true,
                }),
              ],
            });
          }
          setTaskData(prev => ({
            ...prev,
            taskDronerTemp: newArray,
          }));
        } catch (e) {
          console.log(e);
        }
      };
      const getCalculatePrice = async (payload: PayloadCal) => {
        try {
          const res = await PlotDatasource.getCalculatePrice(payload);
          if (res.success) {
            setCalPrice(res.responseData);
          }
        } catch (e) {
          console.log(e);
        }
      };
      return { getLocationPrice, searchDroner, getCalculatePrice };
    }, [taskData.dateAppointment]);
  return (
    <AutoBookingContext.Provider
      value={{
        autoBookingContext: {
          setTaskData,
          getLocationPrice,
          searchDroner,
          getCalculatePrice,
        },
        state: {
          taskData,
          locationPrice,
          calPrice,
        },
      }}>
      {children}
    </AutoBookingContext.Provider>
  );
};
export const useAutoBookingContext = () => React.useContext(AutoBookingContext);
