import React, { useEffect, useState } from 'react';
import AppAuthNavigator from './AppAuthNavigator';
import LoadingNavigator from './LoadingNavigator';
import { createStackNavigator } from '@react-navigation/stack';
import MainNavigator from './MainNavigator';
import { SystemMaintenance } from '../datasource/SystemMaintenanceDatasource';
import MaintenanceScreen from '../screens/MaintenanceScreen/MaintenanceScreen';
import { momentExtend } from '../utils/moment-buddha-year';

const Stack = createStackNavigator();
const AppNavigator: React.FC = () => {
  const [maintenance, setMaintenance] = useState<any>();
  const date = new Date();
  useEffect(() => {
    const getMaintenance = async () => {
      SystemMaintenance.Maintenance()
        .then(res => setMaintenance(res.responseData))
        .catch(err => console.log(err));
    };
    getMaintenance();
  }, []);
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen
        name="initPage"
        component={LoadingNavigator}
        options={{
          gestureEnabled: false,
          headerLeft: () => null,
        }}
      />
      {/* {maintenance !== undefined ? (
        <>
          <Stack.Screen name="Main" component={MaintenanceScreen} />
        </>
      ) : ( */}
        <>
          <Stack.Screen name="Auth" component={AppAuthNavigator} />
          <Stack.Screen name="Main" component={MainNavigator} />
        </>
      {/* )} */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
