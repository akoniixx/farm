import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
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
import CouponDetailScreen from '../screens/PromotionScreen/CouponDetailScreen';
import { CouponCardEntities } from '../entites/CouponCard';
import MyCouponScreen from '../screens/PromotionScreen/MyCouponScreen';
import SearchCouponScreen from '../screens/PromotionScreen/SearchCouponScreen';
import UseCouponScreen from '../screens/PromotionScreen/UseCouponScreen';
import AllCouponScreen from '../screens/PromotionScreen/AllCouponScreen';
import AllNewsScreen from '../screens/NewsScreen/AllNewsScreen';
import DetailGuruScreen from '../screens/NewsScreen/DetailNewsScreen';
import DetailPointScreen from '../screens/PointScreen/DetailPointScreen';
import { DronerHiredScreen } from '../screens/DronerHiredScreen';
import CameraScreen from '../screens/CameraScreen';
import GuruKasetScreen from '../screens/GuruKasetScreen';
import GuruKasetDetailScreen from '../screens/GuruKasetDetailScreen';

export type MainStackParamList = {
  MainScreen: undefined;
  ProfileScreen: undefined;
  AllPlotScreen: undefined;
  FavDronerUsed: undefined;
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
  AddPlotScreen: {
    fromRegister: boolean;
  };
  EditPlotScreen: {
    plotId: string;
    fromRegister: boolean;
  };
  DeleteSuccess: undefined;
  FullScreenTaskImg: undefined;
  AllReviewDroner: undefined;
  CouponDetail: { detail: CouponCardEntities };
  MyCouponScreen: undefined;
  SearchCouponScreen: undefined;
  UseCouponScreen: undefined;
  AllCouponScreen: undefined;
  AllNewsScreen: undefined;
  DetailGuruScreen: undefined;
  DetailPointScreen: undefined;
  DronerHiredScreen: undefined;
  CameraScreen: undefined;
  GuruKasetScreen: undefined;
  GuruKasetDetailScreen: {
    guruId: string;
  };
};
export type StackNativeScreenProps<T extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, T>;

const Stack = createStackNavigator<MainStackParamList>();
const MainNavigator: React.FC<any> = () => {
  return (
    <>
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
        <Stack.Screen
          name="AddPlotScreen"
          component={AddPlotScreen}
          initialParams={{
            fromRegister: false,
          }}
        />
        <Stack.Screen name="SelectDateScreen" component={SelectDateScreen} />
        <Stack.Screen name="SelectPlotScreen" component={SelectPlotScreen} />
        <Stack.Screen name="SelectTarget" component={SelectTarget} />
        <Stack.Screen name="DronerDetail" component={DronerDetail} />
        <Stack.Screen name="FullScreenTaskImg" component={FullScreenTaskImg} />
        <Stack.Screen name="DronerUsedScreen" component={DronerUsedScreen} />
        <Stack.Screen name="PrivacyScreen" component={PrivacyScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="DetailTaskScreen" component={DetailTaskScreen} />
        <Stack.Screen
          name="MyTaskDetailScreen"
          component={MyTaskDetailScreen}
        />
        <Stack.Screen
          name="MyTaskDetailScreenNoti"
          component={MyTaskDetailScreenNoti}
        />
        <Stack.Group
          screenOptions={{
            gestureEnabled: false,
          }}>
          <Stack.Screen
            name="SlipWaitingScreen"
            component={SlipWaitingScreen}
          />
          <Stack.Screen
            name="SlipSuccessScreen"
            component={SlipSuccessScreen}
          />
        </Stack.Group>
        <Stack.Screen name="ViewMapScreen" component={ViewMapScreen} />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <Stack.Screen name="DeleteSuccess" component={DeleteSuccess} />
        <Stack.Screen name="DeleteProfileScreen" component={DeleteProfile} />
        <Stack.Screen name="VerifyOTP" component={VerifyOTP} />
        <Stack.Screen
          name="EditPlotScreen"
          component={EditPlotScreen}
          initialParams={{
            plotId: '',
            fromRegister: false,
          }}
        />
        <Stack.Screen name="AllReviewDroner" component={AllReviewDroner} />
        <Stack.Screen name="CouponDetail" component={CouponDetailScreen} />
        <Stack.Screen name="MyCouponScreen" component={MyCouponScreen} />
        <Stack.Screen
          name="SearchCouponScreen"
          component={SearchCouponScreen}
        />
        <Stack.Screen name="UseCouponScreen" component={UseCouponScreen} />
        <Stack.Screen name="AllCouponScreen" component={AllCouponScreen} />

        <Stack.Screen name="DetailPointScreen" component={DetailPointScreen} />
        <Stack.Screen name="AllNewsScreen" component={AllNewsScreen} />
        <Stack.Screen name="DetailGuruScreen" component={DetailGuruScreen} />
        <Stack.Screen name="DronerHiredScreen" component={DronerHiredScreen} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
        <Stack.Screen name="GuruKasetScreen" component={GuruKasetScreen} />
        <Stack.Screen
          initialParams={{
            guruId: '',
          }}
          name="GuruKasetDetailScreen"
          component={GuruKasetDetailScreen}
        />
      </Stack.Navigator>
    </>
  );
};
export default MainNavigator;
