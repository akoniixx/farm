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
import { useMaintenance } from '../contexts/MaintenanceContext';

const Stack = createStackNavigator();
const AppNavigator: React.FC = () => {
  const {checkTime} = useMaintenance();


  return (
    <>
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
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen name="ForceUpdate" component={ForceUpdateScreen} />
          </>
        )}
      </Stack.Navigator>
    </>
  );
};

export default AppNavigator;
