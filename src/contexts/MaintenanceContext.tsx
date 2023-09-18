import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SystemMaintenance } from '../datasource/SystemMaintenanceDatasource';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import {
  MaintenanceSystem,
  MaintenanceSystem_INIT,
} from '../entites/MaintenanceApp';
import PopUpMaintenance from '../components/Modal/MaintenanceApp/PopUpMaintenance';

interface Context {
  maintenanceData: MaintenanceSystem;
  checkTime: boolean;
  notiMaintenance: boolean;
  checkDataMA: () => Promise<void>;
}
interface Props {
  children: JSX.Element;
}
const MaintenanceContext = React.createContext<Context>({
  checkDataMA: async () => {},
  checkTime: false,
  notiMaintenance: false,
  maintenanceData: {} as MaintenanceSystem,
});
export const MaintenanceProvider: React.FC<Props> = ({ children }) => {
  const [checkTime, setCheckTime] = useState(false);
  const [notiMaintenance, setNotiMaintenance] = useState<boolean>(false);
  const [popupMaintenance, setPopupMaintenance] = useState<boolean>(false);
  const [maintenance, setMaintenance] = useState<MaintenanceSystem>(
    MaintenanceSystem_INIT,
  );

  const checkDataMA = async () => {
    const value = await AsyncStorage.getItem('Maintenance');
    SystemMaintenance.Maintenance('FARMER').then(res => {
      if (res.responseData !== null) {
        setCheckTime(
          checkTimeMaintance(
            moment(res.responseData.dateStart),
            moment(res.responseData.dateEnd),
          ),
        );
        setMaintenance(res.responseData);
        const isMaintenanceActive = checkTimeMaintenancePopUp(
          moment(res.responseData.dateNotiStart),
          moment(res.responseData.dateNotiEnd),
        );
        setNotiMaintenance(isMaintenanceActive);
        if (value !== 'read') {
          setPopupMaintenance(isMaintenanceActive);
        }
      }
    });
  };
  useFocusEffect(
    React.useCallback(() => {
      checkDataMA();
    }, []),
  );

  const checkTimeMaintance = (startDate: any, endDate: any) => {
    const dateNow = moment(Date.now());
    return dateNow.isBetween(startDate, endDate, 'milliseconds');
  };
  const checkTimeMaintenancePopUp = (startDate: any, endDate: any) => {
    const dateNow = moment(Date.now());
    return dateNow.isBetween(startDate, endDate, 'milliseconds');
  };
  return (
    <MaintenanceContext.Provider
      value={{
        checkDataMA,
        checkTime,
        maintenanceData: maintenance,
        notiMaintenance,
      }}>
      <PopUpMaintenance
        show={popupMaintenance}
        onClose={async () => {
          await AsyncStorage.setItem('Maintenance', 'read');
          setPopupMaintenance(!popupMaintenance);
        }}
        data={maintenance}
      />
      {children}
    </MaintenanceContext.Provider>
  );
};
export const useMaintenance = (): Context => {
  const context = React.useContext(MaintenanceContext);
  if (!context) {
    throw new Error('useAuth can be use in AuthContext only');
  }
  return context;
};
