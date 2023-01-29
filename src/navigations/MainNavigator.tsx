import React, { createContext, useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import MainScreen from '../screens/MainScreen/MainScreen';
import AllPlotScreen from '../screens/ProfileScreen/PlotScreen/AllPlotScreen';
import SelectDateScreen from '../screens/AutoBooking/SelectDateScreen';
import DronerDetail from '../screens/DronerProfile/DronerDetail';
import SeeAllDronerUsed from '../screens/DronerProfile/SeeAllDronerUsed';
import SelectPlotScreen from '../screens/AutoBooking/SelectPlotScreen';
import MainTapNavigator from './Bottom/MainTapNavigator';
import SelectTarget from '../screens/AutoBooking/SelectTarget';
import PrivacyScreen from '../screens/ProfileScreen/PrivacyScreen';
import EditProfileScreen from '../screens/ProfileScreen/EditProfileScreen';
import DetailTaskScreen from '../screens/AutoBooking/DetailTaskScreen';
import SlipWaitingScreen from '../screens/SlipWaitingScreen';
import SlipSuccessScreen from '../screens/SlipSuccessScreen';
import ViewMapScreen from '../screens/ViewMapScreen';
import MyTaskDetailScreen from '../screens/MyTaskScreen/MyTaskDetailScreen';
<<<<<<< HEAD
import NotificationScreen from '../screens/NotificationScreen/NotificationScreen';
import MyTaskDetailScreenNoti from '../screens/MyTaskScreen/MyTaskDetailScreenNoti';
=======
>>>>>>> develop
import VerifyOTP from '../screens/ProfileScreen/DeleteProfile/VerifyOTP';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';
import { RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DeleteProfile from '../screens/ProfileScreen/DeleteProfile/DeleteProfile';
import AddPlotScreen from '../screens/ProfileScreen/PlotScreen/AddPlotScreen';
import EditPlotScreen from '../screens/ProfileScreen/PlotScreen/EditPlotScreen';
<<<<<<< HEAD
=======
import NotificationScreen from '../screens/NotificationScreen/NotificationScreen';
>>>>>>> develop
import DeleteSuccess from '../screens/ProfileScreen/DeleteProfile/DeleteSuccess';
export type MainStackParamList = {
  MainScreen: undefined;
  ProfileScreen: undefined;
  AllPlotScreen: undefined;
  SelectDateScreen: undefined;
  SelectPlotScreen: undefined;
  MyTaskDetailScreenNoti : undefined;
  SelectTarget: undefined;
  DronerDetail: undefined;
  SeeAllDronerUsed: undefined;
  PrivacyScreen: undefined;
  EditProfileScreen: undefined;
  DetailTaskScreen: undefined;
  SlipWaitingScreen: { taskId: string; modal?: boolean };
  SlipSuccessScreen: { taskId: string };
  NotificationScreen: undefined;
  ViewMapScreen: {
    location: {
      latitude: string;
      longitude: string;
    };
    plotName: string;
  };
  MyTaskDetailScreen: undefined;
  VerifyOTP: undefined;
  DeleteProfileScreen: {
    navigation: StackNavigationHelpers;
    route: RouteProp<{ params: { id: string } }, 'params'>;
  };
  AddPlotScreen: undefined;
  EditPlotScreen: undefined;
<<<<<<< HEAD
  DeleteSuccess : undefined
=======
  DeleteSuccess: undefined;
>>>>>>> develop
};
export type StackNativeScreenProps<T extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, T>;

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
      <Stack.Screen name="MyTaskDetailScreen" component={MyTaskDetailScreen} />
      <Stack.Screen name="MyTaskDetailScreenNoti" component={MyTaskDetailScreenNoti} />
      <Stack.Group
        screenOptions={{
          gestureEnabled: false,
        }}>
        <Stack.Screen name="SlipWaitingScreen" component={SlipWaitingScreen} />
        <Stack.Screen name="SlipSuccessScreen" component={SlipSuccessScreen} />
      </Stack.Group>
      <Stack.Screen name="ViewMapScreen" component={ViewMapScreen} />
<<<<<<< HEAD
      <Stack.Screen name="NotificationScreen" component={NotificationScreen}/>
      <Stack.Screen name="DeleteSuccess" component={DeleteSuccess} />
=======
>>>>>>> develop
      <Stack.Screen name="DeleteProfileScreen" component={DeleteProfile} />
      <Stack.Screen name="VerifyOTP" component={VerifyOTP} />
      <Stack.Screen name="AddPlotScreen" component={AddPlotScreen} />
      <Stack.Screen name="EditPlotScreen" component={EditPlotScreen} />
<<<<<<< HEAD
=======
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="DeleteSuccess" component={DeleteSuccess} />
>>>>>>> develop
    </Stack.Navigator>
  );
};
export default MainNavigator;
