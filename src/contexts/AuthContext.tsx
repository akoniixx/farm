/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import { ProfileDatasource } from '../datasource/ProfileDatasource';

interface File {
  id: string;
  fileName: string;
  fileType: string;
  resource: string;
  category: string;
  path: string;
}
interface FarmerResponse {
  id: string;
  farmerCode: string;
  pin: string;
  firstname: string;
  lastname: string;
  nickname: string | null;
  idNo: string;
  telephoneNo: string;
  status: string;
  reason: string;
  birthDate: string;
  addressId: string;
  createdAt: string;
  updatedAt: string;
  address: Address;
  farmerPlot: FarmerPlot[];
  file: File[];
}

interface Address {
  id: string;
  address1: string;
  address2: string;
  address3: string | null;
  provinceId: number;
  districtId: number;
  subdistrictId: number;
  postcode: string;
  createdAt: string;
  updatedAt: string;
}

interface FarmerPlot {
  id: string;
  plotName: string;
  raiAmount: string;
  landmark: string;
  plantName: string;
  plantNature: string;
  mapUrl: string;
  lat: string;
  long: string;
  locationName: string;
  farmerId: string;
  plotAreaId: number;
  isActive: boolean;
  status: string;
  plotArea: PlotArea;
  comment: string | null;
  reason: string | null;
  plantCharacteristics: string | null;
  dateWaitPending: string;
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

// If this is part of the FarmerResponse object, you can update it as:

interface Props {
  children: JSX.Element;
}

interface State {
  isLoading: boolean;

  user: FarmerResponse | null;
}

interface Action {
  type: string;
  user?: any;
}

interface Context {
  authContext: {
    getProfileAuth: () => Promise<any>;
  };
  state: State;
}

const initialState = {
  user: null,
  isLoading: true,
};

const AuthContext = React.createContext<Context>({
  authContext: {
    getProfileAuth: Promise.resolve,
  },
  state: initialState,
});

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const reducer = (prevState: State, action: Action): State => {
    switch (action.type) {
      case 'GET_ME':
        return {
          ...prevState,
          user: action.user,
        };

      default:
        return prevState;
    }
  };
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    reducer,
    initialState,
  );

  const authContext = React.useMemo(
    () => ({
      getProfileAuth: async () => {
        try {
          const farmerId = (await AsyncStorage.getItem('farmer_id')) ?? '';

          const data = await ProfileDatasource.getProfile(farmerId);
          dispatch({ type: 'GET_ME', user: data });
          return data;
        } catch (e: any) {
          console.log(e);
        }
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={{ authContext, state }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): Context => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth can be use in AuthContext only');
  }
  return context;
};
