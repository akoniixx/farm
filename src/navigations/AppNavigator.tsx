import React, { useCallback, useEffect, useState } from 'react';
import AppAuthNavigator from './AppAuthNavigator';
import LoadingNavigator from './LoadingNavigator';
import { createStackNavigator } from '@react-navigation/stack';
import MainNavigator from './MainNavigator';
import messaging from '@react-native-firebase/messaging';
import ForceUpdateScreen from '../screens/ForceUpdateScreen';
import {
  MaintenanceSystem,
  MaintenanceSystem_INIT,
} from '../entites/MaintenanceApp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SystemMaintenance } from '../datasource/SystemMaintenanceDatasource';
import moment from 'moment';
import PopUpMaintenance from '../components/Modal/MaintenanceApp/PopUpMaintenance';
import MaintenanceScreen from '../screens/MaintenanceScreen/MaintenanceScreen';
import { useFocusEffect } from '@react-navigation/native';

const Stack = createStackNavigator();
const AppNavigator: React.FC = () => {
  const [checkTime, setCheckTime] = useState(false);
  const [popupMaintenance, setPopupMaintenance] = useState<boolean>(false);
  const [maintenance, setMaintenance] = useState<MaintenanceSystem>(
    MaintenanceSystem_INIT,
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const renderMainTapNavigator = useCallback(
    (props: any) => <MainNavigator {...props} checkDataMA={checkDataMA} />,
    [checkDataMA], // dependencies
  );
  return (
    <>
      <PopUpMaintenance
        show={popupMaintenance}
        onClose={async () => {
          await AsyncStorage.setItem('Maintenance', 'read');
          setPopupMaintenance(!popupMaintenance);
        }}
        data={maintenance}
      />
      <Stack.Navigator
        initialRouteName="initPage"
        screenOptions={{ headerShown: false, gestureEnabled: false }}>
        {checkTime === true ? (
          <Stack.Screen
            name="MaintenanceScreen"
            component={MaintenanceScreen}
            options={{
              gestureEnabled: false,
              headerLeft: () => null,
            }}
          />
        ) : (
          <>
            <Stack.Screen
              name="initPage"
              component={LoadingNavigator}
              options={{
                gestureEnabled: false,
                headerLeft: () => null,
              }}
            />

            <Stack.Screen name="Auth" component={AppAuthNavigator} />
            <Stack.Screen name="Main" component={renderMainTapNavigator} />
            <Stack.Screen name="ForceUpdate" component={ForceUpdateScreen} />
          </>
        )}
      </Stack.Navigator>
    </>
  );
};

export default AppNavigator;
