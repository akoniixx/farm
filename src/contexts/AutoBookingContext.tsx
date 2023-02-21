import moment from 'moment';
import * as React from 'react';
import Spinner from 'react-native-loading-spinner-overlay/lib';
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
    distance: number;
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
  plotDisable: {
    plotId: string;
    isHaveDroner: boolean;
  }[];
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
    setPlotDisable: React.Dispatch<
      React.SetStateAction<
        {
          plotId: string;
          isHaveDroner: boolean;
        }[]
      >
    >;
    getCalculatePrice: (payload: PayloadCal) => Promise<void>;
  };
  state: State;
}
export const initialState: {
  taskData: TaskDataType;
  locationPrice: LocationPriceType;
  calPrice: CalPriceType;
  plotDisable: {
    plotId: string;
    isHaveDroner: boolean;
  }[];
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
  plotDisable: [],
};
const AutoBookingContext = React.createContext<Context>({
  autoBookingContext: {
    setTaskData: () => {},
    setPlotDisable: () => {},
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
  const [plotDisable, setPlotDisable] = React.useState<
    {
      plotId: string;
      isHaveDroner: boolean;
    }[]
  >([]);
  const [loading, setLoading] = React.useState(false);

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
          setLoading(true);

          const res = await PlotDatasource.searchDroner({
            farmerId: farmerId,
            farmerPlotId: farmerPlotId,
            dateAppointment: moment(taskData.dateAppointment).format(
              'YYYY-MM-DD',
            ),
          });

          if (res && res.length > 0) {
            const newDronerFilter = res.filter((el: any) => {
              return el.is_open_receive_task && el.distance < 60;
            });
            const newArray: any = [];
            for (
              let i = 0;
              i < (newDronerFilter.length > 5 ? 5 : newDronerFilter.length);
              i++
            ) {
              newArray.push({
                dronerId: newDronerFilter[i].droner_id,
                status: 'WAIT_RECEIVE',
                distance: newDronerFilter[i].distance,
                dronerDetail: [
                  JSON.stringify({
                    ...newDronerFilter[i],
                    isChecked: true,
                  }),
                ],
              });
            }
            const isAlreadyInDisable = plotDisable.findIndex((el: any) => {
              return el.plotId === farmerPlotId;
            });
            if (newArray.length <= 0 && isAlreadyInDisable === -1) {
              setPlotDisable(prev => [
                ...prev,
                {
                  plotId: farmerPlotId,
                  isHaveDroner: false,
                },
              ]);
              return;
            }
            if (isAlreadyInDisable !== -1 && newArray.length === 0) {
              const newData = [...plotDisable];
              newData[isAlreadyInDisable].isHaveDroner = false;
              return;
            }

            setTaskData(prev => ({
              ...prev,
              taskDronerTemp: newArray,
            }));
          }
        } catch (e) {
          console.log(e);
        } finally {
          setLoading(false);
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
    }, [taskData.dateAppointment, plotDisable]);
  return (
    <AutoBookingContext.Provider
      value={{
        autoBookingContext: {
          setTaskData,
          getLocationPrice,
          searchDroner,
          getCalculatePrice,
          setPlotDisable,
        },
        state: {
          taskData,
          locationPrice,
          calPrice,
          plotDisable,
        },
      }}>
      {children}
      <Spinner
        visible={loading}
        textContent={'กำลังค้นหา...'}
        textStyle={{ color: '#FFF' }}
      />
    </AutoBookingContext.Provider>
  );
};
export const useAutoBookingContext = () => React.useContext(AutoBookingContext);
