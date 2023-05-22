/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppState} from 'react-native';
import {ProfileDatasource} from '../datasource/ProfileDatasource';

interface Address {
  id: string;
  address1: string;
  address2: string;
  address3: string;
  provinceId: number;
  districtId: number;
  subdistrictId: number;
  postcode: string;
  createdAt: string;
  updatedAt: string;
}

interface DroneBrand {
  id: string;
  name: string;
  logoImagePath: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Drone {
  id: string;
  droneBrandId: string;
  series: string;
  droneBrand: DroneBrand;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DronerDrone {
  id: string;
  dronerId: string;
  droneId: string;
  serialNo: string;
  status: string;
  purchaseYear: string;
  purchaseMonth: string;
  reason: any[];
  drone: Drone;
  file: any[];
  createdAt: string;
  updatedAt: string;
  comment: string;
}

interface DronerArea {
  id: string;
  provinceId: number;
  districtId: number;
  subdistrictId: number;
  lat: string;
  long: string;
  distance: string;
  locationName: string;
  mapUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Droner {
  id: string;
  dronerCode: string;
  firstname: string;
  lastname: string;
  idNo: string;
  telephoneNo: string;
  status: string;
  reason: any[];
  birthDate: string;
  isOpenReceiveTask: boolean;
  expYear: number;
  expMonth: number;
  expPlant: string[];
  address: Address;
  dronerDrone: DronerDrone[];
  dronerArea: DronerArea;
  file: any[];
  createdAt: string;
  updatedAt: string;
  isDelete: boolean;
  deleteDate: string | null;
  comment: string;
  updateBy: string;
  createBy: string;
  isBookBank: boolean;
  bankName: string | null;
  bankAccountName: string | null;
  accountNumber: string | null;
  isConsentBookBank: boolean;
}

interface Props {
  children: JSX.Element;
}

interface State {
  isLoading: boolean;

  user: null | Droner;
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

export const AuthProvider: React.FC<Props> = ({children}) => {
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
          const dronerId = (await AsyncStorage.getItem('droner_id')) ?? '';

          const data = await ProfileDatasource.getProfile(dronerId);
          dispatch({type: 'GET_ME', user: data});
          return data;
        } catch (e: any) {
          console.log(e);
        }
      },
    }),
    [],
  );

  React.useEffect(() => {
    if (!state.user) {
      authContext.getProfileAuth();
    }
  }, [authContext, state.user]);

  return (
    <AuthContext.Provider value={{authContext, state}}>
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
