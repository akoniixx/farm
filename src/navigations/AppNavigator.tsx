import React, {useCallback, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AppAuthNavigator from './AppAuthNavigator';
import MainNavigator from './MainNavigator';
import LoadingNavigator from './LoadingNavigator';
import ForceUpdateScreen from '../screens/ForceUpdateScreen';
import MaintenanceScreen from '../screens/MaintenanceScreen/MaintenanceScreen';
import {useMaintenance} from '../contexts/MaintenanceContext';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const {checkTime} = useMaintenance();
  return (
    <>
      <Stack.Navigator
        initialRouteName="initPage"
        screenOptions={{headerShown: false, gestureEnabled: false}}>
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
