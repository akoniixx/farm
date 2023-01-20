import React, { createContext, useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import MainScreen from '../screens/MainScreen/MainScreen';
import AllPlotScreen from '../screens/ProfileScreen/AllPlotScreen';
import SelectDateScreen from '../screens/AutoBooking/SelectDateScreen';
import DronerDetail from '../screens/DronerProfile/DronerDetail';
import SeeAllDronerUsed from '../screens/DronerProfile/SeeAllDronerUsed';
import SelectPlotScreen from '../screens/AutoBooking/SelectPlotScreen';

import DeleteAcc from '../screens/ProfileScreen/DeleteProfile/DeleteAcc';
import DeleteSuccess from '../screens/ProfileScreen/DeleteProfile/DeleteSuccess';
import MainTapNavigator from './Bottom/MainTapNavigator';
import SelectTarget from '../screens/AutoBooking/SelectTarget';
import PrivacyScreen from '../screens/ProfileScreen/PrivacyScreen';
import EditProfileScreen from '../screens/ProfileScreen/EditProfileScreen';
import DetailTaskScreen from '../screens/AutoBooking/DetailTaskScreen';
import SlipWaitingScreen from '../screens/SlipWaitingScreen';
import SlipSuccessScreen from '../screens/SlipSuccessScreen';
import ViewMapScreen from '../screens/ViewMapScreen';
export type MainStackParamList = {
  MainScreen: undefined;
  ProfileScreen: undefined;
  AllPlotScreen: undefined;
  SelectDateScreen: undefined;
  SelectPlotScreen: undefined;
  SelectTarget: undefined;
  DronerDetail: undefined;
  SeeAllDronerUsed: undefined;
  PrivacyScreen: undefined;
  EditProfileScreen: undefined;
  DetailTaskScreen: undefined;
  SlipWaitingScreen: { taskId: string };
  SlipSuccessScreen: { taskId: string };
  DeleteAcc: undefined;
  DeleteSuccess: undefined;
  ViewMapScreen: {
    location: {
      latitude: string;
      longitude: string;
    };
  };
};
const Stack = createStackNavigator<MainStackParamList>();
const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MainScreen"
        component={MainTapNavigator}
        options={{
          gestureEnabled: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="AllPlotScreen" component={AllPlotScreen} />
      <Stack.Screen name="SelectDateScreen" component={SelectDateScreen} />
      <Stack.Screen name="SelectPlotScreen" component={SelectPlotScreen} />
      <Stack.Screen name="SelectTarget" component={SelectTarget} />
      <Stack.Screen name="DronerDetail" component={DronerDetail} />
      <Stack.Screen name="SeeAllDronerUsed" component={SeeAllDronerUsed} />
      <Stack.Screen name="PrivacyScreen" component={PrivacyScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="DetailTaskScreen" component={DetailTaskScreen} />

      <Stack.Group>
        <Stack.Screen name="SlipWaitingScreen" component={SlipWaitingScreen} />
        <Stack.Screen name="SlipSuccessScreen" component={SlipSuccessScreen} />
      </Stack.Group>
      <Stack.Screen name="ViewMapScreen" component={ViewMapScreen} />

      <Stack.Screen name="DeleteAcc" component={DeleteAcc} />
      <Stack.Screen name="DeleteSuccess" component={DeleteSuccess} />
    </Stack.Navigator>
  );
};
export default MainNavigator;
