import React, { createContext, useEffect, useMemo, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import MainScreen from '../screens/MainScreen/MainScreen';
import AllPlotScreen from '../screens/ProfileScreen/PlotScreen/AllPlotScreen';
import SelectDateScreen from '../screens/AutoBooking/SelectDateScreen';
import DronerDetail from '../screens/DronerProfile/DronerDetail';
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
import NotificationScreen from '../screens/NotificationScreen/NotificationScreen';
import MyTaskDetailScreenNoti from '../screens/MyTaskScreen/MyTaskDetailScreenNoti';
import VerifyOTP from '../screens/ProfileScreen/DeleteProfile/VerifyOTP';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';
import { RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DeleteProfile from '../screens/ProfileScreen/DeleteProfile/DeleteProfile';
import AddPlotScreen from '../screens/ProfileScreen/PlotScreen/AddPlotScreen';
import EditPlotScreen from '../screens/ProfileScreen/PlotScreen/EditPlotScreen';
import DeleteSuccess from '../screens/ProfileScreen/DeleteProfile/DeleteSuccess';
import DronerUsedScreen from '../screens/MainScreen/DronerUsedScreen';
import FullScreenTaskImg from '../screens/DronerProfile/FullScreenTaskImg';
import AllReviewDroner from '../screens/DronerProfile/AllReviewDroner';
import {
  MaintenanceSystem,
  MaintenanceSystem_INIT,
} from '../entites/MaintenanceApp';
import { SystemMaintenance } from '../datasource/SystemMaintenanceDatasource';
import moment from 'moment';
import MaintenanceScreen from '../screens/MaintenanceScreen/MaintenanceScreen';
import PopUpMaintenance from '../components/Modal/MaintenanceApp/PopUpMaintenance';
export type MainStackParamList = {
  MainScreen: undefined;
  ProfileScreen: undefined;
  AllPlotScreen: undefined;
  SelectDateScreen: undefined;
  SelectPlotScreen: undefined;
  MyTaskDetailScreenNoti: undefined;
  SelectTarget: undefined;
  DronerDetail: undefined;
  DronerUsedScreen: undefined;
  PrivacyScreen: undefined;
  EditProfileScreen: undefined;
  DetailTaskScreen: undefined;
  SlipWaitingScreen: { taskId: string; modal?: boolean; cntResend?: string };
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
  DeleteSuccess: undefined;
  FullScreenTaskImg: undefined;
  AllReviewDroner: undefined;
  MaintenanceScreen: undefined;
};
export type StackNativeScreenProps<T extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, T>;

const Stack = createStackNavigator<MainStackParamList>();
const MainNavigator: React.FC = () => {
  const dateNow = moment(Date.now());

  const [maintenanceApp, setMaintenanceApp] = useState<MaintenanceSystem>(
    MaintenanceSystem_INIT,
  );
  const [popupMaintenance, setPopupMaintenance] = useState<boolean>(true);
  const [checkTime, setCheckTime] = useState(false);
  const Maintenance = async () => {
    await SystemMaintenance.Maintenance('FARMER')
      .then(res => {
        setCheckTime(
          checkTimeMaintenance(
            moment(res.responseData.dateStart),
            moment(res.responseData.dateEnd),
          ),
        );
        setMaintenanceApp(res.responseData);
      })
      .catch(err => console.log(err));
  };

  const checkTimeMaintenance = (startDate: any, endDate: any) => {
    return dateNow.isBetween(startDate, endDate, 'milliseconds');
  };
  useEffect(() => {
    Maintenance();
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!checkTime ? (
        <Stack.Screen
          name="MainScreen"
          component={MainTapNavigator}
          options={{
            gestureEnabled: false,
            headerLeft: () => null,
          }}
        />
      ) : (
        <Stack.Screen
          name="MaintenanceScreen"
          component={MaintenanceScreen}
          options={{
            gestureEnabled: false,
            headerLeft: () => null,
          }}
        />
      )}

      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="AllPlotScreen" component={AllPlotScreen} />
      <Stack.Screen name="SelectDateScreen" component={SelectDateScreen} />
      <Stack.Screen name="SelectPlotScreen" component={SelectPlotScreen} />
      <Stack.Screen name="SelectTarget" component={SelectTarget} />
      <Stack.Screen name="DronerDetail" component={DronerDetail} />
      <Stack.Screen name="FullScreenTaskImg" component={FullScreenTaskImg} />
      <Stack.Screen name="DronerUsedScreen" component={DronerUsedScreen} />
      <Stack.Screen name="PrivacyScreen" component={PrivacyScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="DetailTaskScreen" component={DetailTaskScreen} />
      <Stack.Screen name="MyTaskDetailScreen" component={MyTaskDetailScreen} />
      <Stack.Screen
        name="MyTaskDetailScreenNoti"
        component={MyTaskDetailScreenNoti}
      />
      <Stack.Group
        screenOptions={{
          gestureEnabled: false,
        }}>
        <Stack.Screen name="SlipWaitingScreen" component={SlipWaitingScreen} />
        <Stack.Screen name="SlipSuccessScreen" component={SlipSuccessScreen} />
      </Stack.Group>
      <Stack.Screen name="ViewMapScreen" component={ViewMapScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="DeleteSuccess" component={DeleteSuccess} />
      <Stack.Screen name="DeleteProfileScreen" component={DeleteProfile} />
      <Stack.Screen name="VerifyOTP" component={VerifyOTP} />
      <Stack.Screen name="AddPlotScreen" component={AddPlotScreen} />
      <Stack.Screen name="EditPlotScreen" component={EditPlotScreen} />
      <Stack.Screen name="AllReviewDroner" component={AllReviewDroner} />
    </Stack.Navigator>
  );
};
export default MainNavigator;
