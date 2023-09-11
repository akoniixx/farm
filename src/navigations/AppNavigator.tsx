import React from 'react';
import AppAuthNavigator from './AppAuthNavigator';
import LoadingNavigator from './LoadingNavigator';
import { createStackNavigator } from '@react-navigation/stack';
import MainNavigator from './MainNavigator';

import ForceUpdateScreen from '../screens/ForceUpdateScreen';

const Stack = createStackNavigator();
const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="initPage"
      screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen
        name="initPage"
        component={LoadingNavigator}
        options={{
          gestureEnabled: false,
          headerLeft: () => null,
        }}
      />
      <>
        <Stack.Screen name="Auth" component={AppAuthNavigator} />
        <Stack.Screen name="Main" component={MainNavigator} />
        <Stack.Screen name="ForceUpdate" component={ForceUpdateScreen} />
      </>
    </Stack.Navigator>
  );
};

export default AppNavigator;
